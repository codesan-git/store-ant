import { Fragment, useState } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { Product, ProductInCart, Status } from "@prisma/client";
import Link from "next/link";

interface Props {
  ProductStatus: Status
  // product: Product
}

//TODO: Nama toko jadi size sm, yang lain jadi xs

const ProductTransaction = ({ ProductStatus}: Props) => { //TODO: readjust background colors based on website. the one in the wireframe are just placeholder colors.

  const [extraActionsIsOpen, setExtraActionsIsOpen] = useState<Boolean>(false);

  const extraActionsModal = () => {
    return(
      <div id="berlangsung-bottom-modal" hidden={!extraActionsIsOpen.valueOf()} className="lg:hidden align-bottom bg-gray-900 bg-opacity-75 fixed w-full h-full -top-2 right-0 left-0 bottom-0 z-50">
        <div className="h-1/2" onClick={() => setExtraActionsIsOpen(false)}>
        </div>
        <div id="berlangsung-modal-box" className="p-2 bg-white h-1/2 w-full rounded-lg overflow-y-hidden overscroll-contain">
          <div id="main-menu-modal-x-container" className="flex flex-row space-x-2">
            <button onClick={() => setExtraActionsIsOpen(false)} className="font-bold text-2xl">✕</button>
            <h1 className="font-bold text-2xl">Extra</h1>
          </div>
          <div id="berlangsung-modal-content">
            <ul>
              <li>
                <Link href={''} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <div className="flex justify-center items-center text-center lg:pl-6">
                    Tanya Penjual
                  </div>
                </Link>
                <Link href={''} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <div className="flex justify-center items-center text-center lg:pl-6">
                    Batalkan
                  </div>
                </Link>
                <Link href={''} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <div className="flex justify-center items-center text-center lg:pl-6">
                    Pusat Bantuan
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const renderTransactionStatus = () => {
    if (ProductStatus === Status.UNPAID) return <h1 className="flex justify-end text-sm font-bold">Bayar Sebelum</h1>;
    if (ProductStatus === Status.CANCELED || ProductStatus == Status.CANCEL_REJECTED) return <h1 className="flex justify-end text-sm font-bold text-red-600">Dibatalkan Sistem</h1>; //CANCELED||CANCELED_REJECTED == FAILED
    if (ProductStatus === Status.AWAITING_CONFIRMATION || ProductStatus === Status.PACKING) return <h1 className="flex justify-end text-sm font-bold">Otomatis Batal</h1>; //PACKING == BEING_PROCESSED
    if (ProductStatus === Status.REACHED_DESTINATION) return <h1 className="flex justify-end text-sm font-bold">Otomatis Selesai</h1>;

    return <></>;
  }

  const renderActionButtons = () => { //TODO: REFACTOR THIS SWITCH CASE CODE SMELL

    const renderExtraActionDropdown = () => { //THIS STILL CAUSES A BUG. If you enter web-view mode, and click various extra action buttons consecutively, then enter mobile mode, there will be a stack of extra actions modal
      return(
        <div className="">
          <button onClick={() => setExtraActionsIsOpen(!extraActionsIsOpen)} className="lg:hidden w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white"/>
          </button>
          <div className="hidden lg:block dropdown dropdown-end">
            <label onClick={() => setExtraActionsIsOpen(true)} tabIndex={0} className="w-8 h-8 flex justify-center items-center bg-black">
              <HiOutlineEllipsisVertical className="text-white"/>
            </label>
            <ul tabIndex={0} className="mt-1 dropdown-content menu shadow bg-base-100 rounded-sm w-52">
              <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Tanya Penjual</a></li>
              <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Batalkan</a></li>
              <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Pusat Bantuan</a></li>
            </ul>
          </div>
        </div>
      );
    }


    //better idea: Create a callback function argument that passes all the handle functions and buttons to render as objects and render them there

    if(ProductStatus === Status.UNPAID){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-24 h-8 text-white bg-green-500">
            Bayar
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.AWAITING_CONFIRMATION){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-28 lg:w-32 h-8 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.FINISHED){ // FINISHED == SUCCESS
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Ulas Produk
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.CANCELED || ProductStatus === Status.CANCEL_REJECTED){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.PACKING){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.AWAITING_COURIER){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Cek Resi
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.DELIVERING){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Cek Resi
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (ProductStatus === Status.REACHED_DESTINATION){
      return (
        <Fragment>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 border-2 border-green-500 text-green-500">
            Detail Transaksi
          </button>
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Selesai
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }

    return <Fragment>
      {renderExtraActionDropdown()}
    </Fragment>;
  }

  return (
   <Fragment>
    <div className="">
      <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
        <div className="w-1/2 flex justify-start items-center ">
          <h1 className="text-sm lg:text-xl font-bold">Nama Toko</h1>
        </div>
        <div className="w-1/2 flex flex-col lg:flex-row lg:items-center lg:space-x-2 justify-end">
          {renderTransactionStatus()}
          <h1 className="flex justify-end text-xs lg:text-sm">29 Mei 2023, 15:00</h1>
        </div>
      </div>
      <div id="lower-detail">
        <div id="product-details" className="flex flex-row p-2 bg-gray-300">
          <div id="product-detail-img-container" className=" flex justify-center items-center">
            <img className="w-36 h-36 object-cover" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
          </div>
          <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
            <h1 className="text-xs lg:text-base">Kode Transaksi</h1>
            <h1 className="text-xs lg:text-base font-bold">Nama Barang</h1>
            <h1 className="text-xs lg:text-base">Qty</h1>
            <h1 className="text-xs lg:text-base">+X Produk Lainnya</h1>
          </div>
          <div id="total-details-lower" className="hidden lg:flex lg:flex-col lg:justify-center w-1/3 p-4 space-y-2 border-l-gray-500 border-l-2">
            <h1 className="">Total Belanja</h1>
            <h1 className="font-bold">Rp Jumlah Harga</h1>
          </div>
        </div>
        <div id="total-section" className="flex flex-row p-2 bg-gray-400">
          <div id="total-details" className="w-1/3 lg:hidden">
            <h1 className="text-xs">Total Belanja</h1>
            <h1 className="text-xs">Rp Jumlah Harga</h1>
          </div>
          <div id="transaction-actions" className="w-2/3 lg:w-full flex flex-row justify-end space-x-2">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
    {extraActionsModal()}
   </Fragment>
  );
}

export default ProductTransaction;