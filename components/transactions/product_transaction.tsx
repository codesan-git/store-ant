import { Fragment } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";

const ProductTransaction = () => {
  return (
   <Fragment>
    <div className="">
      <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
        <div className="w-1/2 flex justify-start items-center ">
          <h1 className="text-xl font-bold">Nama Toko</h1>
        </div>
        <div className="w-1/2 flex flex-col lg:flex-row justify-end">
          <h1 className="flex justify-end text-sm font-bold">Bayar sebelum</h1>
          <h1 className="flex justify-end text-sm">29 Mei 2023, 15:00</h1>
        </div>
      </div>
      <div id="lower-detail">
        <div id="product-details" className="flex flex-row space-x-2 p-2 bg-gray-300">
          <div id="product-detail-img-container" className="">
            <img className="w-24 h-24 object-cover" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
          </div>
          <div>
            <h1 className="">Kode Transaksi</h1>
            <h1 className=" font-bold">Nama Barang</h1>
            <h1 className="">Qty</h1>
            <h1 className="">+X Produk Lainnya</h1>
          </div>
        </div>
        <div id="total-section" className="flex flex-row p-2 bg-gray-400">
          <div id="total-details" className="w-1/2">
            <h1 className="text-xs">Total Belanja</h1>
            <h1 className="text-xs">Rp Jumlah Harga</h1>
          </div>
          <div id="transaction-actions" className="w-1/2 flex flex-row justify-end space-x-2">
            <button onClick={(e) => e.preventDefault()} className="w-24 text-white bg-green-500">
              Bayar
            </button>
            <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
              <HiOutlineEllipsisVertical className="text-white"/>
            </button>
          </div>
        </div>
      </div>
    </div>
   </Fragment>
  );
}

export default ProductTransaction;