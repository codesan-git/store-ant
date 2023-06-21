import { Fragment } from "react";
import { BiStoreAlt } from "react-icons/bi";

interface Props {
  detailTransactionModalArguments: () => any;
}

const DetailTransaksiModal = ( { detailTransactionModalArguments }: Props) => {

	//TODO: create callback function to get modalOpenState from Transactions page

	const { transactionModalIsHidden, setTransactionModalIsHidden } = detailTransactionModalArguments();

  return (
		<Fragment>
			<div hidden={transactionModalIsHidden} id="new-modal-custom" className=" align-bottom bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 z-50 pointer-events-auto">
				<div id="detail-transaksi-modal-box" className="py-4 bg-white h-full w-full rounded-lg pointer-events-auto">
					<div id="detail-transaksi-modal-top" className="h-12 flex flex-row px-4">
						<div className="w-3/4">
							<h1 className="text-3xl">Detail Transaksi</h1>
						</div>
						<div className="w-1/4 flex justify-end">
							<button onClick={setTransactionModalIsHidden} className="text-lg font-bold hover:cursor-pointer">✕</button>
						</div>
					</div>
					<div id="contents" className="px-4 pb-14 h-full space-y-4 overflow-y-auto">
						<div id="status-details">
							<h1 className="text-xl font-bold">Status</h1>
							<p className=""><span className="text-orange-800">Diproses</span> | Batal Otomatis: 26 Juni 2023, 10:30 WIB</p>
						</div>
						<div id="invoice-details">
							<h1 className="text-xl font-bold">No. Invoice</h1>
							<p>abcdefghijklmnop</p>
						</div>
						<div id="purchase-date-details">
							<h1 className="text-xl font-bold">Tanggal Pembelian</h1>
							<p>24 Juni 2023, 10:30 WIB</p>
						</div>
						<div id="detail-produk" className="w-full border-2 rounded-lg p-4 border-black">
							<div className="flex flex-row space-x-1">
								<BiStoreAlt className="h-6 w-6"/>
								<h1 className="font-bold">Toko Ageng Bagus</h1>
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
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore culpa in, iure nobis amet deleniti facere molestiae atque delectus et laboriosam ratione tempora. Nemo minus earum, culpa modi rerum laboriosam! 
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
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad magni obcaecati ea distinctio quaerat impedit mollitia dolorem quisquam nesciunt, vitae inventore quae. Optio laborum tempora officiis iste, suscipit eaque perferendis!
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
									Rp 123,456
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
							<div id="delivery-expense" className="flex flex-row">
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

export default DetailTransaksiModal;