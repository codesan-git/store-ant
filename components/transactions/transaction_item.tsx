import { Fragment, useState } from "react";
import { HiOutlineEllipsisVertical, HiShoppingCart } from "react-icons/hi2";
import { Product, Order as PrismaOrder, ProductInCart, Transaction as PrismaTransaction, TransactionStatus } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";


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
  order: Order[],
  shop: {
    userId: string,
    shopName: string
  },
}

interface Props {
  transaction: Transaction,
  onBayar: (transaction: Transaction) => Promise<void>,
  onCancel: (transaction: Transaction) => Promise<void>,
  onFinish: (id: string) => Promise<void>,
  onReturn: (id: string) => Promise<void>,
  onDetail: (transaction: Transaction) => void,
  onComplain: (transaction: Transaction) => void,
  onRating: (transaction: Transaction) => void,
  onRate: (productName: String, cartItemId: Number) => void,
  onSentItem: (transaction: Transaction) => Promise<void>
}

const TransactionItem = ({ transaction, onRate: onRateClick, onBayar, onCancel, onFinish, onReturn, onDetail, onComplain, onRating, onSentItem }: Props) => { //TODO: re-adjust background colors based on website. the one in the wireframe are just placeholder colors.

  const transactionCreatedDate = new Date(transaction.createdAt);
  const transactionLastUpdate = new Date(transaction.updatedAt);
  const router = useRouter();

  const onPenjualClick = () => {
    router.push(`/transactions?newChatUserId=${transaction.shop.userId}`);
  }

  const renderTransactionDate = () => { //TODO: try using locale format function next time
    return (
      <Fragment>
        <h1>{transactionCreatedDate.toDateString()}</h1>
      </Fragment>
    );
  }

  const renderExtraItems = () => {

    if (transaction.order.length === 1) return <></>;

    return (
      <Fragment>
        <h1 className="text-xs lg:text-base">+{transaction.order.length - 1} Produk Lainnya</h1>
      </Fragment>
    );
  }

  const calculateTransactionTotal = (): Number => {

    const orders = transaction.order

    let total = 0;

    orders?.forEach((order) => {
      total += (order.product.price * order.count)
    });

    return total;
  }

  const [extraActionsIsOpen, setExtraActionsIsOpen] = useState<Boolean>(false);

  const extraActionsModal = () => {
    return (
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
                <div onClick={onPenjualClick} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                  <div className="flex justify-center items-center text-center lg:pl-6">
                    Tanya Penjual
                  </div>
                </div>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                  <label onClick={() => onCancel(transaction)} htmlFor="cancel-alert" className="flex justify-center items-center text-center lg:pl-6">
                    Batalkan
                  </label>
                </div>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                  <div className="flex justify-center items-center text-center lg:pl-6">
                    Pusat Bantuan
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const renderTransactionStatus = () => {
    if (transaction.status === TransactionStatus.UNPAID) return <h1 className="flex justify-end text-sm font-bold">Bayar Sebelum</h1>;
    if (transaction.status === TransactionStatus.DELIVERING) return <h1 className="flex justify-end text-sm font-bold">Sedang Dikirim</h1>;
    if (transaction.status === TransactionStatus.DELIVERED) return <h1 className="flex justify-end text-sm font-bold">Pesanan Sampai</h1>;
    if (transaction.status === TransactionStatus.CANCELING) return <h1 className="flex justify-end text-sm font-bold text-yellow-600">Pembatalan Diajukan</h1>;
    if (transaction.status === TransactionStatus.RETURNING) return <h1 className="flex justify-end text-sm font-bold text-yellow-600">Pengembalian Diajukan</h1>;
    if (transaction.status === TransactionStatus.ITEM_RECEIVE) return <h1 className="flex justify-end text-sm font-bold text-green-600">Item Diterima</h1>;
    if (transaction.status === TransactionStatus.SENT_ITEM) return <h1 className="flex justify-end text-sm font-bold text-yellow-600">Mengirim Barang</h1>;
    if (transaction.status === TransactionStatus.CANCELED) return <h1 className="flex justify-end text-sm font-bold text-red-600">Dibatalkan Sistem</h1>; //CANCELED||CANCELED_REJECTED == FAILED
    if (transaction.status === TransactionStatus.RETURNED) return <h1 className="flex justify-end text-sm font-bold text-red-600">Pesanan Dikembalikan</h1>;
    if (transaction.status === TransactionStatus.RETURN_REJECTED) return <h1 className="flex justify-end text-sm font-bold text-blue-900">Pengembalian Ditolak</h1>;
    if (transaction.status === TransactionStatus.CANCEL_REJECTED) return <h1 className="flex justify-end text-sm font-bold text-blue-900">Pembatalan Ditolak</h1>;
    if (transaction.status === TransactionStatus.AWAITING_CONFIRMATION || transaction.status === TransactionStatus.PACKING) return <h1 className="flex justify-end text-sm font-bold">Otomatis Batal</h1>; //PACKING == BEING_PROCESSED

    return <></>;
  }

  const renderActionButtons = () => { //TODO: REFACTOR THIS SWITCH CASE CODE SMELL

    const detailTransaksiButton = () => {
      return (
        <button onClick={() => onDetail(transaction)} className="flex justify-center items-center text-xs lg:text-base w-28 lg:w-32 h-8 border-2 border-green-500 text-green-500">
          Detail Transaksi
        </button>
      );
    }
    //console.log(`transaction`, transaction)
    const renderExtraActionDropdown = () => { //THIS STILL CAUSES A BUG. If you enter web-view mode, and click various extra action buttons consecutively, then enter mobile mode, there will be a stack of extra actions modal
      return (
        <div className="">
          <button id="extra-actions-mobile" onClick={() => setExtraActionsIsOpen(!extraActionsIsOpen)} className="lg:hidden w-8 h-8 flex justify-center items-center bg-black">
            <HiOutlineEllipsisVertical className="text-white" />
          </button>
          <div id="extra-actions-web-view" className="hidden lg:block dropdown dropdown-end">
            <label onClick={() => setExtraActionsIsOpen(true)} tabIndex={0} className="w-8 h-8 flex justify-center items-center bg-black hover:cursor-pointer">
              <HiOutlineEllipsisVertical className="text-white" />
            </label>
            <ul tabIndex={0} className="mt-1 dropdown-content menu shadow bg-base-100 rounded-sm w-52">
              <li className="rounded-sm hover:bg-gray-100 transition duration-300"><div onClick={onPenjualClick}>Tanya Penjual</div></li>
              { //I really need to refactor this entire module
                (transaction.status === TransactionStatus.UNPAID || transaction.status === TransactionStatus.AWAITING_CONFIRMATION || transaction.status === TransactionStatus.PACKING)
                  ? <li className="rounded-sm hover:bg-gray-100 transition duration-300">
                    <label onClick={() => onCancel(transaction)} htmlFor="cancel-alert">
                      Batalkan
                    </label>
                  </li>
                  // : <li className="rounded-sm hover:bg-gray-100 transition duration-300"><div onClick={()=>onReturn(transaction.id)}>Ajukan Komplain</div></li>
                  : <li className="rounded-sm hover:bg-gray-100 transition duration-300"><button onClick={() => onComplain(transaction)}>Ajukan Komplain</button></li>
              }
              <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Pusat Bantuan</a></li>
            </ul>
          </div>
        </div>
      );
    }

    //better idea: Create a callback function argument that passes all the handle functions and buttons to render as objects and render them there

    if (transaction.status === TransactionStatus.UNPAID) {
      return (
        <Fragment>
          <label htmlFor="payment-modal" onClick={() => onBayar(transaction)} className="text-xs lg:text-base flex justify-center items-center w-24 h-8 text-white bg-green-500 hover:cursor-pointer">
            Bayar
          </label>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    if (transaction.status === TransactionStatus.RETURNED) {
      return (
        <Fragment>
          <label htmlFor="sentitem-modal" onClick={() => onSentItem(transaction)} className="text-xs lg:text-base flex justify-center items-center w-24 h-8 text-white bg-green-500 hover:cursor-pointer">
            Kirim Barang
          </label>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    if (transaction.status === TransactionStatus.SENT_ITEM) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Lacak
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    if (transaction.status === TransactionStatus.AWAITING_CONFIRMATION) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (transaction.status === TransactionStatus.FINISHED) { // FINISHED == SUCCESS
      return (
        <Fragment>
          {detailTransaksiButton()}
          {/* <label htmlFor="review-modal" onClick={onRateClick} className="flex justify-center items-center text-xs lg:text-base w-32 text-white bg-green-500 hover:cursor-pointer">
            Ulas Produk
          </label> */}
          <div className="flex justify-center items-center text-xs lg:text-base w-32 text-white bg-green-500 hover:cursor-pointer" onClick={() => onRating(transaction)}>
            Ulas Produk
          </div>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (transaction.status === TransactionStatus.CANCELED || transaction.status === TransactionStatus.CANCEL_REJECTED) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (transaction.status === TransactionStatus.PACKING) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    else if (transaction.status === TransactionStatus.DELIVERING) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
            Lacak
          </button>
          {renderExtraActionDropdown()}
        </Fragment>
      );
    }
    if (transaction.status === TransactionStatus.DELIVERED) {
      return (
        <Fragment>
          {detailTransaksiButton()}
          <button onClick={()=>onFinish(transaction.id)} className="text-xs lg:text-base w-32 text-white bg-green-500">
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
            <h1 className="text-sm lg:text-xl font-bold">{transaction.shop.shopName}</h1>
          </div>
          <div className="w-1/2 flex flex-col lg:flex-row lg:items-center lg:space-x-2 justify-end">
            {renderTransactionStatus()}
            {(transaction.status === TransactionStatus.DELIVERING)
              ? <></>
              : <h1 className="flex justify-end text-xs lg:text-sm">{transactionLastUpdate.toDateString()}</h1>
            }
          </div>
        </div>
        <div id="lower-detail">
          <div id="product-details" className="flex flex-row p-2 bg-gray-300">
            <div id="product-detail-img-container" className=" flex justify-center items-center">
              <Image className="w-36 h-36 object-cover"
                src={transaction?.order?.at(0)?.product?.image?.split(",")[0] as string}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                }}
                alt=''
                width={1500}
                height={1500}
              />
            </div>
            <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
              <h1 className="text-xs lg:text-base">Kode Transaksi: {transaction.id}</h1>
              <h1 className="text-xs lg:text-base font-bold">{transaction.order.at(0)?.product.name.toString()}</h1>
              <h1 className="text-xs lg:text-base">Jumlah: {transaction.order.at(0)?.count.toString()}</h1>
              {renderExtraItems()}
            </div>
            <div id="total-details-lower" className="hidden lg:flex lg:flex-col lg:justify-center w-1/3 p-4 space-y-2 border-l-gray-500 border-l-2">
              <h1 className="">Total Belanja</h1>
              <h1 className="font-bold">Rp {calculateTransactionTotal().toString()}</h1>
            </div>
          </div>
          <div id="total-section" className="flex flex-row p-2 bg-gray-400">
            <div id="total-details" className="w-1/3 lg:hidden">
              <h1 className="text-xs">Total Belanja</h1>
              <h1 className="text-xs">Rp {calculateTransactionTotal().toString()}</h1>
            </div>
            <div className="w-1/3 hidden lg:flex lg:flex-row lg:justify-start lg:items-center">
              <HiShoppingCart className="mr-1" />
              {renderTransactionDate()}
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

export default TransactionItem;