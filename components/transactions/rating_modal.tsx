import { Product, ProductInCart, Shop, TransactionStatus } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { Fragment, useEffect, useState, useRef, ChangeEvent } from "react";
import { BiStoreAlt } from "react-icons/bi";
import { HiOutlineCamera, HiPlus } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import useSWR from 'swr';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import router, { useRouter } from "next/navigation";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";


interface Props {
    ratingTransactionModalArguments: () => any;
}

interface Order {
    id: number,
    transactionId: number,
    productId: number,
    count: number,
    createdAt: Date,
    updatedAt: Date,
    product: Product
}

interface Transaction {
    id: number,
    userId: number,
    shopId: number,
    status: TransactionStatus,
    createdAt: Date,
    updatedAt: Date,
    paymentMethod: string,
    order: Order[],
    shop: {
        shopName: string
    }
}
interface FormData {
    orderId: number,
    star: number,
    comment: string
}

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

const RatingModal = ({ ratingTransactionModalArguments }: Props) => {

    const {
        ratingModalIsHidden,
        setRatingModalIsHidden,
        getTransactionRating
    } = ratingTransactionModalArguments();



    const { selectedTransaction: transaction }: { selectedTransaction: Transaction | undefined } = getTransactionRating(); //this is pretty cursed lol -
    const mapValue = transaction?.order.map((orders: any) => ({
        value: orders.id
    }))
    const initialOrders = transaction?.order ? transaction.order.map(orders => String(orders.id)) : [];
    const [shop, setShop] = useState<Shop>();
    const [selectedFiles, setSelectedFiles] = useState<Array<Array<File>>>([]);
    const [urls, setURLs] = useState<Array<Array<string>>>([]);
    const [form, setForm] = useState<FormData[]>([]);
    const [submit, setSubmit] = useState(false);

    const router = useRouter()

    useEffect(() => {

        let isSameLength = urls.length == selectedFiles.length;

        if (isSameLength) {
            for (let i = 0; i < urls.length; i++) {
                if (urls[i].length != selectedFiles[i].length)
                    isSameLength = false;
            }
        }

        if (isSameLength && submit) {
            try {
                const promises = form.map(async (formItem, index) => {
                    const { orderId, star, comment } = formItem;
                    const images = urls[index];
                    //console.log("urls index length: ", images.length);
                    const data = { orderId: String(orderId), star: String(star), comment: String(comment), image: images.join(",") }

                    axios.post(`/api/cart/rate`, data).then(() => router.refresh());
                });
            } catch (error) {
                console.error(error);
            }
        }
    }, [urls, submit]);

    const fetchShop = async () => {
        try {
            const response = await axios.get(`/api/shop/${transaction?.shopId}`, {
                params: {
                },
            });

            const { shop } = response.data;
            setShop(shop);
        } catch (error) {

        }
    };

    const transactionDate = new Date(transaction?.createdAt!);


    const productItem = (order: Order) => {

        let total = 0;
        total = order.count * order.product.price

        return (
            <Fragment>
                <div className="flex flex-row mt-2 space-x-1">
                    <div id="image-placeholder" className="p-1 flex items-center">
                        <Image
                            alt=""
                            width={1500}
                            height={1500}
                            className="w-14 h-14 object-cover"
                            src={String(order?.product?.image?.split(",")[0])}
                        />
                    </div>
                    <div className="p-2 flex items-center">
                        <h1>{order?.count}x</h1>
                    </div>
                    <div className="flex-1">
                        <div className=" p-0.5">
                            {order?.product.name}
                        </div>
                        <div className=" p-0.5">
                            {total.toString()}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }


    const renderTransactionStatus = () => {
        if (transaction?.status == TransactionStatus.CANCELED || transaction?.status == TransactionStatus.CANCEL_REJECTED) {
            return <p className=""><span className="text-red-600">Cancelled</span> | Dibatalkan Sistem</p>;
        }
        else if (transaction?.status == TransactionStatus.FINISHED) {
            return <p className=""><span className="text-blue-900">Finished</span></p>
        }
        else {
            return <p className=""><span className="text-orange-800">Diproses</span> | Batal Otomatis: 26 Juni 2023, 10:30 WIB</p>
        }
    }

    const calculateTransactionTotal = (): Number => {

        const orders = transaction?.order

        let total = 0;

        orders?.forEach((order) => {
            total += (order.product.price)
        });

        return total;
    }

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const fileType = file.type;
            const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if (validImageTypes.includes(fileType)) {
                setSelectedFiles((prevFiles) => {
                    const updatedFiles = [...prevFiles];
                    const images = updatedFiles[index] || [];

                    if (images.length < 5) {
                        images.push(file);
                        updatedFiles[index] = images;
                        return updatedFiles;
                    } else {
                        console.log("Max limit reached for images.");
                        return prevFiles;
                    }
                });
            } else {
                console.log("Only images are accepted.");
            }
        }
    };

    const removeImage = (fileIndex: number, imageIndex: number) => {
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles[fileIndex] = updatedSelectedFiles[fileIndex].filter(
            (_, index) => index !== imageIndex
        );
        setSelectedFiles(updatedSelectedFiles);
    };

    const renderInputMessage = (index: number) => {

        if (selectedFiles.length >= 5) return (
            <>
                <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
                    <HiOutlinePhoto className='w-6 h-6' />
                    <p className='text-xs lg:text-base'>&nbsp;You have reached the max limit for photos.</p>
                </label>
            </>
        );

        return (
            <>
                <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
                    <HiOutlineCamera className='w-6 h-6' />
                    &nbsp;Select Image
                </label>
            </>
        );
    }

    const renderSelectedImages = () => {
        return (
            <div className="gap-x-4 my-auto">
                {selectedFiles.map((imageArray, fileIndex) => (
                    <div key={fileIndex} className="border border-black  space-y-10 p-5 rounded-md mb-5 ">
                        {/* <div className="w-full mx-auto block">
                            <p>{transaction?.order[fileIndex]?.id}</p>
                        </div> */}
                        <div className="flex flex-row gap-2 justify-around">
                            {imageArray.map((file, imageIndex) => (
                                <div key={imageIndex} className="relative">
                                    <div className="flex">
                                        <div
                                            onClick={() => removeImage(fileIndex, imageIndex)}
                                            className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 cursor-pointer"
                                        >
                                            ✕
                                        </div>
                                        <div>
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                width={1500}
                                                height={1500}
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };




    const handleRatingChange = (index: number, value: number) => {
        setForm((prevForm) => {
            const updatedForm = [...prevForm];
            updatedForm[index].star = value;
            return updatedForm;
        });
    };

    const handleCommentChange = (index: number, value: string) => {
        setForm((prevForm) => {
            const updatedForm = [...prevForm];
            updatedForm[index].comment = value;
            return updatedForm;
        });
    };
    const handleSubmit = async () => {
        const promises: any[] = [];
        const storage = getStorage();
        setSubmit(true);

        selectedFiles.map((file, index) => {
            file.map((fileData) => {
                //console.log("loop");

                const sotrageRef = ref(storage, `images/rating/${fileData.name}`);

                const uploadTask = uploadBytesResumable(sotrageRef, fileData);
                promises.push(uploadTask);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const prog = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        // setProgress(prog);
                    },
                    (error) => console.log(error),
                    async () => {
                        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
                            //console.log("URLS ISINYA: ", urls);
                            let tempUrls = urls;
                            //console.log("TEMP URLS ISINYA: ", tempUrls);

                            if (!tempUrls[index])
                                tempUrls.push([]);

                            let url = tempUrls[index];
                            url?.push(downloadURLs);
                            tempUrls[index] = url;
                            setURLs(tempUrls);
                            const reference = [...urls];
                            setURLs(reference);
                        });
                    }
                );
            })
        });
        Promise.all(promises)
            .then(async () => {
                alert("All images uploaded");
            })
            .then((err) => console.log(err));
    };

    useEffect(() => {
        if (transaction && transaction.order.length > 0) {
            const initialForm = transaction.order.map((order) => ({
                orderId: order.id,
                star: 0,
                comment: ""
            }));
            setForm(initialForm);
        }
    }, [transaction]);

    return (
        <Fragment>
            <div hidden={ratingModalIsHidden} id="new-modal-custom" className="bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 z-50 pointer-events-auto">
                <div className="flex justify-center items-center h-full w-full lg:h-5/6 pointer-events-auto mx-auto">
                    <div id="detail-transaksi-modal-box" className="relative py-4 bg-white h-full w-full lg:w-5/6 lg:h-5/6 rounded-lg pointer-events-auto">
                        <div id="detail-transaksi-modal-top" className="h-12 flex flex-row px-4 lg:h-1/6">
                            <div className="w-3/4 lg:flex lg:items-center">
                                <h1 className="text-3xl font-bold">Rating Product</h1>
                            </div>
                            <div className="w-1/4 flex justify-end static items-start my-auto">
                                <button onClick={setRatingModalIsHidden} className="text-4xl font-bold float-right">✕</button>
                            </div>
                        </div>
                        <div id="contents" className="px-4 pb-14 lg:pb-0 h-full lg:h-5/6 space-y-4 overflow-y-auto overflow-x-auto">
                            <div id="invoice-details" className="bg-blue-gray-100 rounded-md">
                                <div className="mx-5 py-2 flex space-x-3">
                                    <h1 className="text-xl font-bold">No. Invoice</h1>
                                    <p className="text-xl">{transaction?.id.toString()}</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-x-4">
                                    <div className="">
                                        <p>{transaction?.shop.shopName}</p>
                                    </div>
                                <div className="">
                                    {form.map((formData, index) => (
                                        <div key={formData.orderId}>
                                            <div className="flex space-x-4">
                                                {/* <div id="invoice-product"> */}
                                                    {/* <h1 className="text-xl font-bold">No. Invoice</h1> */}
                                                    {/* <p>{formData.orderId.toString()}</p> */}
                                                {/* </div> */}
                                                {/* ... */}
                                                <div>
                                                    <div id="rating-description">
                                                        <div id="rating-star" className="gap-4">
                                                            <StyledRating
                                                                name="highlight-selected-only"
                                                                defaultValue={2}
                                                                IconContainerComponent={IconContainer}
                                                                getLabelText={(value: number) => customIcons[value].label}
                                                                highlightSelectedOnly
                                                                onChange={(e: any) => handleRatingChange(index, e.target.value)}
                                                            />
                                                        </div>
                                                        <textarea
                                                            className="textarea textarea-bordered resize-none rounded-md"
                                                            placeholder="Text rating"
                                                            value={formData.comment}
                                                            onChange={(e) => handleCommentChange(index, e.target.value)}
                                                        ></textarea>
                                                        {/* <p>Image For Product {transaction?.order[index].id}</p> */}
                                                    </div>
                                                    <div key={index} id="rating-image" className="border-gray-600 my-2 border border-dashed rounded-sm flex justify-center items-center w-full">
                                                        <input
                                                            // disabled={selectedFiles[index].length >= 5}
                                                            type="file"
                                                            accept=".jpg, .jpeg, .png, .webp"
                                                            name={`product-image-${index}`}
                                                            id={`product-image-input-${index}`}
                                                            className=" cursor-pointer opacity-0 absolute rounded-md"
                                                            onChange={(event) => handleFile(event, index)}
                                                        />
                                                        {renderInputMessage(index)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {renderSelectedImages()}
                            </div>
                            {/* {renderSelectedImages()} */}
                        </div>
                        <div id="button-action" className="absolute bottom-0 right-0 mb-10 mr-10">
                            <div className="flex justify-end gap-x-4">
                                <div className="btn w-20 h-8 m-auto text-center text-white border rounded-md bg-red-500 border-red-500 hover:bg-transparent hover:text-black">Batal</div>
                                <div
                                    onClick={() => handleSubmit()}
                                    className="btn cursor-pointer w-20 h-8 text-white text-center rounded-md green hover:border bg-green-500 border-green-500 hover:bg-transparent hover:text-black"
                                >
                                    Ajukan
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    );
}

export default RatingModal;