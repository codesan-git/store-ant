import { Address, Product, ProductInCart, Profile, Shop, TransactionStatus } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { BiStoreAlt } from "react-icons/bi";
import useSWR from 'swr';

interface Props {
  detailTransactionModalArguments: () => any;
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
  id: string,
  userId: string,
  shopId: number,
  status: TransactionStatus,
  createdAt: Date,
  updatedAt: Date,
  paymentMethod: string,
  shippingCost:  number,
  order: Order[],
  shop: {
    userId: string,
    shopName: string,
    user: {
      profile: Profile
      & {
        addresses: Address[]
      }
    }
  },
}

const DetailTransactionModal = ( { detailTransactionModalArguments }: Props) => {

	const formatter = new Intl.NumberFormat(
		'id-ID',
		{
			style: 'currency',
			currency: 'IDR',
			
		}
	);

	const { 
		transactionModalIsHidden, 
		setTransactionModalIsHidden,
		getTransactionDetail
	} = detailTransactionModalArguments();
	
	const { selectedTransaction: transaction } : { selectedTransaction: Transaction | undefined} = getTransactionDetail(); //this is pretty cursed lol -
	const [shop, setShop] = useState<Shop>();

	const address = transaction?.shop.user.profile.addresses[0];
	
	const fetchShop = async () => {
		try {
			const response = await axios.get(`/api/shop/${transaction?.shopId}`, {
				params: {
				},
      });
      
			const { shop } =  response.data;
			setShop(shop);
    } catch (error) {
			
    }
  };
	
	useEffect(() => {
		fetchShop()
	},[]);
	
	const transactionDate = new Date(transaction?.createdAt!);
	

	const productItem = (order: Order) => {

		let total = 0;
		total = order.count * order.product.price;

		return (
			<Fragment>
				<div className="flex flex-row mt-2 space-x-1">
					<div id="image-placeholder" className="p-1 flex items-center">
						<Image 
							className="w-14 h-14 object-cover"
							src={order?.product?.image?.split(",")[0] as string}
							alt=""
							width={1500}
							height={1500}
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
							{formatter.format(total).split(/\,[0-9][0-9]/)}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	const renderTransactionStatus = () => {
		if(transaction?.status == TransactionStatus.CANCELED || transaction?.status == TransactionStatus.CANCEL_REJECTED){
			return <p className=""><span className="text-red-600">Cancelled</span> | Dibatalkan Sistem</p>;
		}
		else if (transaction?.status == TransactionStatus.FINISHED){
			return <p className=""><span className="text-blue-900">Finished</span></p>
		}
		else {
			return <p className=""><span className="text-orange-800">Diproses</span> | Batal Otomatis: 26 Juni 2023, 10:30 WIB</p>
		}
	}

	const calculateTransactionTotal = ( ) : Number => {

    const orders = transaction?.order
    
    let total = 0;

    orders?.forEach((order) => {
      total += (order.product.price * order.count)
    });

    return total;
  }

  return (
		<Fragment>
			<div hidden={transactionModalIsHidden} id="new-modal-custom" className="bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 z-50 pointer-events-auto">
				<div className="flex justify-center items-center h-full lg:h-5/6 pointer-events-auto">
					<div id="detail-transaksi-modal-box" className="py-4 bg-white h-full w-full lg:w-5/6 lg:h-5/6 rounded-lg pointer-events-auto">
						<div id="detail-transaksi-modal-top" className="h-12 flex flex-row px-4 lg:h-1/6">
							<div className="w-3/4 lg:flex lg:items-center">
								<h1 className="text-3xl font-bold">Detail Transaksi</h1>
							</div>
							<div className="w-1/4 flex justify-end static items-start">
								<button onClick={setTransactionModalIsHidden} className="text-4xl font-bold float-right">✕</button>
							</div>
						</div>
						<div id="contents" className="px-4 pb-14 lg:pb-0 h-full lg:h-5/6 space-y-4 overflow-y-auto">
							<div id="status-details">
								<h1 className="text-xl font-bold">Status</h1>
								{renderTransactionStatus()}
							</div>
							<div id="invoice-details">
								<h1 className="text-xl font-bold">No. Invoice</h1>
								<p>{transaction?.id.toString()}</p>
							</div>
							<div id="purchase-date-details">
								<h1 className="text-xl font-bold">Tanggal Pembelian</h1>
								<p>{transactionDate.toDateString()}</p>
							</div>
							<div id="detail-produk" className="w-full border-2 rounded-lg p-4 border-black">
								<div className="flex flex-row space-x-1">
									<BiStoreAlt className="h-6 w-6"/>
									<h1 className="font-bold">{transaction?.shop.shopName}</h1>
								</div>
								<div  id="purchased-products-list">
									{transaction?.order.map((order) => productItem(order))}
								</div>
								<div className="">
									<h1 className="font-bold flex justify-end">Total Belanja: Rp {calculateTransactionTotal().toString()}</h1>
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
										<p className="font-bold">{shop?.shopName}</p>
										<p>{address?.contact}</p>
										<p className="mt-2">J{address?.address}, {address?.region}, {address?.city}, {address?.province}</p>
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
										{transaction?.paymentMethod.toString()}
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
										{calculateTransactionTotal().toString()}
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
										{transaction?.shippingCost}
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
			</div>
		</Fragment>
	);
}

export default DetailTransactionModal;