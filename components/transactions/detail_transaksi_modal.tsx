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
							<h1 className="text-2xl">Detail Transaksi</h1>
						</div>
						<div className="w-1/4 flex justify-end">
							<label htmlFor={id} className="text-lg font-bold">✕</label>
						</div>
					</div>
					<div id="contents">
						<div id="status-details">
							<h1 className="text-xl font-bold">Status</h1>
							<p><span className="text-orange-800">Diproses</span> | Batal Otomatis: 26 Juni 2023, 10:30 WIB</p>
						</div>
						<div id="invoice-details">
							<h1>No. Invoice</h1>
							<p>abcdefghijklmnop</p>
						</div>
						<div id="detail-produk">
							<BiStoreAlt/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default DetailTransaksiModal;