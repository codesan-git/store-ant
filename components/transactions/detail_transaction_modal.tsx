import { Product, ProductInCart, Status } from "@prisma/client";
import { Fragment, useEffect } from "react";
import { BiStoreAlt } from "react-icons/bi";
import useSWR from 'swr';


interface Props {
  detailTransactionModalArguments: () => any;
}

interface CartItemObject {
  id: number;
  product: Product;
  count: number;
  price: number;
  status: Status;
}

const DetailTransactionModal = ( { detailTransactionModalArguments }: Props) => {

	//TODO: create callback function to get modalOpenState from Transactions page

	const { 
		transactionModalIsHidden, 
		setTransactionModalIsHidden,
		getTransactionDetail
	} = detailTransactionModalArguments();

	const { selectedTransaction: transaction } : { selectedTransaction: CartItemObject | undefined} = getTransactionDetail(); //this is pretty cursed lol -

	// const fetchProduct = async (url: string) => {
	// 	console.log(`fetching from ${url}`)
	// 	const response = await fetch(url);

	// 	if(!response.ok) throw new Error("Failed to fetch Categories for Navbar");
	// 	console.log('responsejson: ')
	// 	console.log(response.json());
	// 	return response.json();
	// }

	// const {data: product} = useSWR<Product>(
	// 	`http://localhost:3000/api/product/{${transaction?.productId}}`,
	// 	fetchProduct
	// );

	// useEffect(() => {},[transaction]);

	const productTotal = () => {
		if(transaction){
			console.log(`product total function ${transaction.product.name}`)
			console.log(`product total function ${transaction.count}`)
			console.log(`detail transaction, transaction price: ${transaction.price}`)

			const total = transaction.count * transaction.product.price;
			return `Rp. ${total.toString()}`;
		}

		return "0";
	}

	const productItem = () => {
		return (
			<Fragment>
				<div className="flex flex-row mt-2 space-x-1">
					<div id="image-placeholder" className="p-1 flex items-center">
						<div className="w-14 h-14 bg-green-900">

						</div>
					</div>
					<div className="p-2 flex items-center">
						<h1>{transaction?.count}x</h1>
					</div>
					<div className="flex-1">
						<div className=" p-0.5">
							{transaction?.product.name}
						</div>
						<div className=" p-0.5">
							{productTotal()}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	const renderTransactionStatus = () => {
		if(transaction?.status == Status.CANCELED || transaction?.status == Status.CANCEL_REJECTED){
			return <p className=""><span className="text-red-600">{transaction?.status}</span> | Dibatalkan Sistem</p>;
		}
		else if (transaction?.status == Status.FINISHED){
			return <p className=""><span className="text-blue-900">{transaction?.status}</span></p>
		}
		else {
			return <p className=""><span className="text-orange-800">{transaction?.status}</span> | Batal Otomatis: 26 Juni 2023, 10:30 WIB</p>
		}
	}

  return (
		<Fragment>
			<div hidden={transactionModalIsHidden} id="new-modal-custom" className=" align-bottom bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 z-50 pointer-events-auto">
				<div id="detail-transaksi-modal-box" className="py-4 bg-white h-full w-full rounded-lg pointer-events-auto">
					<div id="detail-transaksi-modal-top" className="h-12 flex flex-row px-4">
						<div className="w-3/4">
							<h1 className="text-3xl font-bold">Detail Transaksi</h1>
						</div>
						<div className="w-1/4 flex justify-end">
							<button onClick={setTransactionModalIsHidden} className="text-3xl font-bold hover:cursor-pointer">✕</button>
						</div>
					</div>
					<div id="contents" className="px-4 pb-14 h-full space-y-4 overflow-y-auto">
						<div id="status-details">
							<h1 className="text-xl font-bold">Status</h1>
							{renderTransactionStatus()}
						</div>
						<div id="invoice-details">
							<h1 className="text-xl font-bold">No. Invoice</h1>
							<p>abcdefghijklmnop</p>
						</div>
						<div id="purchase-date-details">
							<h1 className="text-xl font-bold">Tanggal Pembelian</h1>
							<p>26 Juni 2023, 10:30 WIB</p>
						</div>
						<div id="detail-produk" className="w-full border-2 rounded-lg p-4 border-black">
							<div className="flex flex-row space-x-1">
								<BiStoreAlt className="h-6 w-6"/>
								<h1 className="font-bold">Toko Ageng Bagus</h1>
							</div>
							<div  id="purchased-products-list">
								{productItem()}
							</div>
							<div className="">
								<h1 className="font-bold flex justify-end">Total Belanja: {productTotal()}</h1>
							</div>
						</div>
						<div id="delivery-details">
							<h1 className="text-xl font-bold">Pengiriman</h1>
							<div id="courier-details" className="flex flex-row space-x-2">
								<div className="w-1/3">
									Kurir
								</div>
								<div className="w-2">
									:
								</div>
								<div className="w-full">
									<p>StoreAnt Aja - Reguler</p>
									<p className="italic">{`(Estimasi Tiba: 30 Juni 2023)`}</p>
								</div>
							</div>
							<div id="address-details" className="flex flex-row space-x-2">
								<div className="w-1/3">
									Alamat
								</div>
								<div className="w-2">
									:
								</div>
								<div className="w-full">
									<p className="font-bold">Ageng Bagus</p>
									<p>081234567890</p>
									<p className="mt-2">Jalan Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque esse minus necessitatibus adipisci qua</p>
								</div>
							</div>
						</div>
						<div id="payment-details">
							<h1 className="text-xl font-bold">Rincian Pembayaran</h1>
							<div id="payment-method" className="flex flex-row">
								<div className="w-1/2">
									Metode Pembayaran
								</div>
								<div className="w-2">
									:
								</div>
								<div className="">
									BCA Virtual Account
								</div>
							</div>
							<div id="total-spent" className="flex flex-row">
								<div className="w-1/2">
									Total Belanja
								</div>
								<div className="w-2">
									:
								</div>
								<div className="">
									{productTotal()}
								</div>
							</div>
							<div id="delivery-expense" className="flex flex-row">
								<div className="w-1/2">
									Biaya Pengiriman
								</div>
								<div className="w-2">
									:
								</div>
								<div className="">
									Rp 0
								</div>
							</div>
							<hr className="h-px my-2 bg-black border-0"/>
							<div id="delivery-expense" className="flex flex-row font-bold">
								<div className="w-1/2">
									Harga Total
								</div>
								<div className="w-2">
									:
								</div>
								<div className="">
									Rp 123,456
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default DetailTransactionModal;