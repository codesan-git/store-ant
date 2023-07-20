import Orders from "@/pages/shop/orders";
import { Product, ProductInCart, Shop, TransactionStatus } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { Fragment, useEffect, useState, useRef } from "react";
import { BiStoreAlt } from "react-icons/bi";
import { HiOutlineCamera, HiPlus } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import useSWR from 'swr';

interface Props {
	complainTransactionModalArguments: () => any;
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
interface FormData{
	orderId:number[],
	description:string
}

const ComplainModal = ({ complainTransactionModalArguments }: Props) => {

	const {
		complainModalIsHidden,
		setComplainModalIsHidden,
		getTransactionComplain
	} = complainTransactionModalArguments();

	const { selectedTransaction: transaction }: { selectedTransaction: Transaction | undefined } = getTransactionComplain(); //this is pretty cursed lol -
	const [shop, setShop] = useState<Shop>();
	const [fillProduct, setFillProduct] = useState<number[]>([]);
	const [complainDesc, setComplainDesc] = useState<string>("")
	const [isAddProduct, setIsAddProduct] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string>();
	const [selectedFiles, setFile] = useState<any[]>([]);
	const [form, setForm] = useState<FormData>({orderId:[],description:""});

	const ref = useRef<any>(null)

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

	const postComplain = async () => {
				try {
					if (selectedFiles.length == 0) return;
					const formData = new FormData();
					selectedFiles.forEach((file) => formData.append("image", file));
					formData.append("orderId", form.orderId.join(','));
					formData.append("description", form.description);
					await axios.post(`/api/complain/create`, formData)
				} catch (error) {
					console.error(error);
				}
			// }
		// }
	};

	useEffect(() => {
		fetchShop()
	}, []);

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

	const renderSelectedProduct = () => {
		return transaction?.order.map((orders) => {
			if (form.orderId.includes(orders.id)) {
				return (
					<div key={orders.id} className="flex gap-4">
						<img
							src={orders?.product.image || ""}
							alt=""
							className="w-16 h-16 border border-dotted bg-gray-300 border-green-800"
						/>
						<div className="my-auto font-bold">
							<p>{orders?.product.name}</p>
						</div>
						<div
							className="my-auto font-bold cursor-pointer"
							onClick={() => {
								const index = fillProduct.findIndex((obj) => obj === orders.id);
								if (index !== -1) {
									fillProduct.splice(index, 1);
									// Lakukan tindakan lain setelah menghapus order
								}
							}}
						>
							X
						</div>
					</div>
				);
			}
			return null;
		});
	};

	function handleFile(target: any) {
		let file = target.files;

		for (let i = 0; i < file.length; i++) {
			const fileType = file[i]["type"];
			const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
			if (validImageTypes.includes(fileType)) {
				setFile([...selectedFiles, file[i]]);
			} else {
				console.log("only images accepted");
			}
			console.log("FILES: ", selectedFiles);
		}
	};

	const removeImage = (i: string) => {
		setFile(selectedFiles.filter((x) => x.name !== i));
		if (selectedFiles.length >= 2)
			setSelectedImage(URL.createObjectURL(selectedFiles[selectedFiles.length - 2]));
	};

	const renderInputMessage = () => {

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
		if (selectedFiles.length == 0) return;

		return (
			<>
				<div className='flex flex-row gap-2'>
					{
						selectedFiles.map(
							(file, key) =>
								<div key={key} className="relative">
									<div onClick={() => removeImage(file.name)} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer">
										✕
									</div>
									<img src={URL.createObjectURL(file)} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" />
								</div>
						)
					}
				</div>
			</>
		);

	}

	// console.log(`isOpen`, isAddProduct)
	console.log(`fill`, form.orderId)
	console.log(`complain`, form.description)
	console.log(`imgUrl`, selectedImage)
	console.log(`formdata`, form)
	useEffect(() => {
		console.log(`complain`, { complainDesc })
		console.log(`imgUrl`, selectedImage)
		// transaction?.order
		renderSelectedProduct()
	}, [])
	return (
		<Fragment>
			<div hidden={complainModalIsHidden} id="new-modal-custom" className="bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 z-50 pointer-events-auto">
				<div className="flex justify-center items-center h-[30rem] w-[30rem] lg:h-5/6 pointer-events-auto mx-auto">
					<div id="detail-transaksi-modal-box" className="py-4 bg-white h-full w-full lg:w-5/6 lg:h-5/6 rounded-lg pointer-events-auto">
						<div id="detail-transaksi-modal-top" className="h-12 flex flex-row px-4 lg:h-1/6">
							<div className="w-3/4 lg:flex lg:items-center">
								<h1 className="text-3xl font-bold">Pengajuan Complain</h1>
							</div>
							<div className="w-1/4 flex justify-end static items-start my-auto">
								<button onClick={setComplainModalIsHidden} className="text-4xl font-bold float-right">✕</button>
							</div>
						</div>
						<div id="contents" className="px-4 pb-14 lg:pb-0 h-full lg:h-5/6 space-y-4 overflow-y-auto">
							<div id="invoice-details">
								<h1 className="text-xl font-bold">No. Invoice</h1>
								<p>{transaction?.id.toString()}</p>
							</div>
							<div id="selected-products">
								<div className="my-auto font-bold">
									<p>Selected Products</p>
								</div>
								<div className="gap-4">
									{renderSelectedProduct()}
									{/* {transaction?.order.map((orders) => (
										<>
											{
												fillProduct.includes(orders.id) &&
												<>
													<div className="flex gap-4">
														<img
															src={orders?.product.image || ""}
															alt=""
															className="w-16 h-16 border border-dotted bg-gray-300 border-green-800"
														/>
														<div className="my-auto font-bold">
															<p>{orders?.product.name}</p>
														</div>
														<div className="my-auto font-bold cursor-pointer" onClick={
															()=>{const obj = fillProduct.findIndex(object => {
															return object === orders.id;
														})
														fillProduct.splice(obj,1)
														}}>X</div>
												</div>
										</>
											}
								</>
									))} */}
								</div>
							</div>
							<div id="select-orders" className="">
								<div className="my-auto font-bold">
									<p>Item Bermasalah</p>
								</div>
								<div className="flex gap-4 cursor-pointer" onClick={() => { setIsAddProduct(!isAddProduct) }}>
									<div className="flex w-16 h-16 border border-dotted bg-gray-300 border-green-800">
										<HiPlus className="m-auto" />
									</div>
									<div className="my-auto font-bold">
										<p>Add Item</p>
									</div>
								</div>
							</div>
							<div>
								{isAddProduct ?
									<>
										<select className="select w-1/2 max-w-xs rounded-sm" placeholder="Select Product" onChange={e => setForm({...form, orderId: form.orderId.concat(Number(e.target.value))})}>
											<option disabled selected>Select Product</option>
											{transaction?.order.map((orders) => (
												<>
													<option key={orders.id} value={orders.id} >
														{orders.id}
														{orders.product.name}
													</option>
												</>
											))}
										</select>
									</>
									:
									<>

									</>
								}
							</div>
							<div id="complain-description">
								<textarea
									className="textarea textarea-bordered w-full rounded-sm"
									placeholder="Text Complain"
									onChange={e => setForm({...form,description:e.target.value})}
								></textarea>
							</div>
							<div id="complain-image" className="cursor-pointer">
								<h1 className="text-xl font-bold">Upload Gambar</h1>
								{/* <div className="flex border border-dashed border-black w-full h-48 m-auto">
									<div className="flex m-auto cursor-pointer" onClick={() => ref.current?.click()}>[<HiPlus className="my-auto" />] Select Image</div>
									<input ref={ref} type="file" className="hidden m-auto cursor-pointer" onChange={(e: any) => setSelectedImage(e.target.value)} />
								</div> */}
								<form action="" className='lg:flex lg:flex-row'>
									<section className='px-4 lg:w-1/2 flex flex-col justify-center items-center space-y-4'>
										<div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-40 w-full lg:h-5/6 lg:w-5/6 relative'>
											<input disabled={selectedFiles.length >= 5} type="file" accept='.jpg, .jpeg, .png, .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute'
												onChange={({ target }) => {
													handleFile(target);
													if (target.files) {
														const file = target.files[0];
														if (file)
															setSelectedImage(URL.createObjectURL(file));
													}
												}}
											/>
											{renderInputMessage()}
										</div>
										{renderSelectedImages()}
									</section>
								</form>
							</div>
							<div id="button-action" className="flex justify-end">
								<div className="w-20 h-8 m-auto border border-red-500 hover:bg-red-500 ">Batal</div>
								<div
									onClick={postComplain}
									className="w-20 h-8 m-auto bg-green-500 hover:border border-green-500 bg-transparent"
								>Ajukan</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment >
	);
}

export default ComplainModal;