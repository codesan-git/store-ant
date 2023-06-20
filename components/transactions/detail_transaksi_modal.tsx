import { Fragment } from "react";
import { BiStoreAlt } from "react-icons/bi";

interface Props {
  htmlElementId: string,
  // selectProductCallback: () => any;
}

const DetailTransaksiModal = ( { htmlElementId: id }: Props) => {
  return (
		<Fragment>
			<input type="checkbox" id={id} className="modal-toggle"/>
			<div id={id} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box space-y-2">
					<div id="detail-transaksi-modal-top" className="flex flex-row">
						<div className="w-3/4">
							<h1 className="text-3xl">Detail Transaksi</h1>
						</div>
						<div className="w-1/4 flex justify-end">
							<label htmlFor={id} className="text-lg font-bold hover:cursor-pointer">✕</label>
						</div>
					</div>
					<div id="contents" className="space-y-4 overflow-y-auto">
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
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, aliquam optio adipisci cum debitis blanditiis accusamus dolorum fugiat voluptates, exercitationem dicta. Quisquam vero, nam repudiandae aliquid cum voluptate saepe nobis.
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
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, aliquam optio adipisci cum debitis blanditiis accusamus dolorum fugiat voluptates, exercitationem dicta. Quisquam vero, nam repudiandae aliquid cum voluptate saepe nobis.
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
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default DetailTransaksiModal;