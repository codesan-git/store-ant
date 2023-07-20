import Orders from "@/pages/shop/orders";
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
    const [fillProduct, setFillProduct] = useState<number[]>([]);
    const [ratingDesc, setratingDesc] = useState<string>("")
    const [isAddProduct, setIsAddProduct] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string>();
    // const [selectedFiles, setFile] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Array<Array<File>>>([]);
    const [getValue, setGetValue] = useState<string[]>(initialOrders)
    // const [form, setForm] = useState<FormData>({
    //     orderId: 0,
    //     star: 0,
    //     comment: ""
    // });
    const [form, setForm] = useState<FormData[]>([]);



    const [value, setValue] = useState<number | null>(2);
    const [hover, setHover] = useState(-1);

    const ref = useRef<any>(null)
    const router = useRouter()



    const fetchShop = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/shop/${transaction?.shopId}`, {
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
                        <img className="w-14 h-14 object-cover"
                            src={`http://localhost:3000/${order?.product?.image?.split(",")[0]}`}
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
            <div className="flex flex-row gap-x-4 justify-around">
                {selectedFiles.map((imageArray, fileIndex) => (
                    <div key={fileIndex}>
                        <div className="w-full font-bold block mb-3">
                            <p>Image For Product {transaction?.order[fileIndex]?.id}</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            {imageArray.map((file, imageIndex) => (
                                <div key={imageIndex} className="relative flex">
                                    <div
                                        onClick={() => removeImage(fileIndex, imageIndex)}
                                        className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer"
                                    >
                                        ✕
                                    </div>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600"
                                    />
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
        try {
            const promises = form.map(async (formItem, index) => {
                const { orderId, star, comment } = formItem;
                const formData = new FormData();
                formData.append("orderId", String(orderId));
                formData.append("star", String(star));
                formData.append("comment", comment);

                const images = selectedFiles[index];
                if (images && images.length > 0) {
                    images.forEach((image, imageIndex) => {
                        formData.append("image", image);
                    });
                }

                await axios.post(`/api/cart/rate`, formData).then(() => router.refresh());
            });

            // await Promise.all(promises);
        } catch (error) {
            console.error(error);
        }
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


    // console.log(`fill`, transaction?.order[0].id)
    console.log(`getValue`, getValue)
    // console.log(`comment`, form.comment)
    // console.log(`rare`, form.star)
    // console.log(`imgUrl`, selectedImage)
    // console.log(`formdata`, form)
    // useEffect(() => {
    //     console.log(`rating`, { ratingDesc })
    //     console.log(`imgUrl`, selectedImage)
    //     renderSelectedProduct()
    // }, [])
    console.log(`formData`, form)
    console.log(`transaction`, transaction)
    console.log(`File`, selectedFiles)
    // console.log(`getTransactionProps`, getTransactionRating())
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
                            <div id="invoice-details">
                                <h1 className="text-xl font-bold">No. Invoice</h1>
                                <p>{transaction?.id.toString()}</p>
                            </div>
                            <div className="flex flex-row gap-x-4 justify-around">
                                {form.map((formData, index) => (
                                    <div key={formData.orderId}>
                                        <div>
                                            <div id="invoice-product">
                                                <h1 className="text-xl font-bold">No. Invoice</h1>
                                                <p>{formData.orderId.toString()}</p>
                                            </div>
                                            {/* ... */}
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
                                            <div id="rating-description">
                                                <textarea
                                                    className="textarea textarea-bordered w-full rounded-sm"
                                                    placeholder="Text rating"
                                                    value={formData.comment}
                                                    onChange={(e) => handleCommentChange(index, e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div key={index} id="rating-image" className="border-gray-600 my-2 border border-dashed rounded-sm flex justify-center items-center w-full lg:h-full lg:w-full relative">
                                                <input
                                                    // disabled={selectedFiles[index].length >= 5}
                                                    type="file"
                                                    accept=".jpg, .jpeg, .png, .webp"
                                                    name={`product-image-${index}`}
                                                    id={`product-image-input-${index}`}
                                                    className="w-full h-full cursor-pointer opacity-0 absolute"
                                                    onChange={(event) => handleFile(event, index)}
                                                />
                                                {renderInputMessage(index)}
                                            </div>
                                            {/* <p>Image For Product {transaction?.order[index].id}</p> */}
                                        </div>
                                    </div>

                                ))}
                            </div>
                            {renderSelectedImages()}
                        </div>
                        <div id="button-action" className="absolute bottom-0 right-0 mb-10 mr-10">
                            <div className="flex justify-end gap-x-4">
                                <div className="btn btn-outline w-20 h-8 m-auto text-center border rounded-sm bg-transparent border-red-500 hover:bg-red-500">Batal</div>
                                <div
                                    onClick={() => handleSubmit()}
                                    className="btn cursor-pointer w-20 h-8 text-white text-center rounded-sm green hover:border bg-green-500 border-green-500 hover:bg-transparent hover:text-black"
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