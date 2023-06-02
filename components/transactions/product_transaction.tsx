import { Fragment } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { Status } from "@prisma/client";

interface Props {
  ProductStatus: TRANSACTION_STATUS
}

export enum TRANSACTION_STATUS {
  AWAITING_PAYMENT,
  AWAITING_CONFIRMATION,
  SUCCESS,
  FAILED,
  BEING_PROCESSED,
  AWAITING_COURIER,
  DELIVERING,
  REACHED_DESTINATION
}

const ProductTransaction = ({ ProductStatus }: Props) => { //TODO: readjust background colors based on website. the one in the wireframe are just placeholder colors.

  const renderActionButtons = () => { //TODO: REFACTOR THIS SWITCH CASE CODE SMELL

    //it's either this way of dynamic rendering or a long switch case code smell
    const bayarButtonStatuses:  Array<TRANSACTION_STATUS> = [TRANSACTION_STATUS.AWAITING_PAYMENT];
    const detailTransaksiButtonStatuses: Array<TRANSACTION_STATUS> = [
      TRANSACTION_STATUS.AWAITING_CONFIRMATION, 
      TRANSACTION_STATUS.BEING_PROCESSED, 
      TRANSACTION_STATUS.AWAITING_COURIER, 
      TRANSACTION_STATUS.DELIVERING, 
      TRANSACTION_STATUS.REACHED_DESTINATION, 
      TRANSACTION_STATUS.SUCCESS, 
      TRANSACTION_STATUS.FAILED
    ];

    const bayarButton = <button onClick={(e) => e.preventDefault()} className="w-24 text-white bg-green-500">Bayar</button>
    const detailTransaksiButton = <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">Detail Transaksi</button>
    const ulasProdukButton = <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">Ulas Produk</button>
    const cekResiButton = <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">Cek Resi</button>
    const selesaiButton =<button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">Selesai</button>

    //better idea: Create a callback function argument that passes all the handle functions and buttons to render as objects and render them there

    if(ProductStatus === TRANSACTION_STATUS.AWAITING_PAYMENT){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-24 text-white bg-green-500">
            Bayar
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.AWAITING_CONFIRMATION){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.SUCCESS){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">
            Ulas Produk
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.FAILED){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.BEING_PROCESSED){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.AWAITING_COURIER){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">
            Cek Resi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.DELIVERING){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">
            Cek Resi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }
    else if (ProductStatus === TRANSACTION_STATUS.REACHED_DESTINATION){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-32 text-white bg-green-500">
            Selesai
          </button>
          <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
        </Fragment>
      );
    }

    return <Fragment>
      {bayarButtonStatuses.includes(ProductStatus) ? bayarButton : null}
      {}
      <button onClick={(e) => e.preventDefault()} className="w-8 h-8 flex justify-center items-center bg-black">
        <HiOutlineEllipsisVertical className="text-white"/>
      </button>
    </Fragment>;
  }

  return (
   <Fragment>
    <div className="">
      <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
        <div className="w-1/2 flex justify-start items-center ">
          <h1 className="text-xl font-bold">Nama Toko</h1>
        </div>
        <div className="w-1/2 flex flex-col lg:flex-row lg:items-center lg:space-x-2 justify-end">
          <h1 id="transaction-status" className="flex justify-end text-sm font-bold">Bayar sebelum</h1>
          <h1 className="flex justify-end text-sm">29 Mei 2023, 15:00</h1>
        </div>
      </div>
      <div id="lower-detail">
        <div id="product-details" className="flex flex-row p-2 bg-gray-300">
          <div id="product-detail-img-container" className=" flex justify-center items-center">
            <img className="w-36 h-36 object-cover" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
          </div>
          <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
            <h1 className="">Kode Transaksi</h1>
            <h1 className="font-bold">Nama Barang</h1>
            <h1 className="">Qty</h1>
            <h1 className="">+X Produk Lainnya</h1>
          </div>
          <div id="total-details-lower" className="hidden lg:flex lg:flex-col lg:justify-center w-1/3 p-4 space-y-2 border-l-gray-500 border-l-2">
            <h1 className="">Total Belanja</h1>
            <h1 className="font-bold">Rp Jumlah Harga</h1>
          </div>
        </div>
        <div id="total-section" className="flex flex-row p-2 bg-gray-400">
          <div id="total-details" className="w-1/2 lg:hidden">
            <h1 className="text-xs">Total Belanja</h1>
            <h1 className="text-xs">Rp Jumlah Harga</h1>
          </div>
          <div id="transaction-actions" className="w-1/2 lg:w-full flex flex-row justify-end space-x-2">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
   </Fragment>
  );
}

export default ProductTransaction;