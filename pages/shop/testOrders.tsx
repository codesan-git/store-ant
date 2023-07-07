import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import ProductCard from '@/components/index/product_card';
import Navbar from '../navbar'
import Footer from '../footer'
import ShopDashboard from '../../components/shop/shop_dashboard'
import Image from 'next/image'

import ReviewModal from "@/components/transactions/review_modal";
import TransactionsDashboard from "@/components/transactions/transactions_dashboard";
import TransactionItem from "@/components/transactions/transaction_item";
import PaymentModal from "@/components/transactions/payment_modal";
import CancelAlert from "@/components/transactions/user_cancel_alert";
import DetailTransactionModal from "@/components/transactions/detail_transaction_modal";

import { Order as PrismaOrder, Transaction as PrismaTransaction, TransactionStatus } from "@prisma/client";
import transactions from '../transactions'

import {
  HiHome, HiChartPie, HiChatBubbleBottomCenterText,
  HiShoppingBag, HiCurrencyDollar, HiChevronDown,
  HiChevronUp,
  HiShoppingCart,
  HiOutlineEllipsisVertical
} from "react-icons/hi2";
import Agungageng from '@/components/shop/agungageng'

interface Props {
  shop: {
    id: Number,
    shopName: string,
    averageRating: Number,
    balance: number
    transaction: Transaction[]
  },
  product: {
    id: Number,
    shopId: Number,
    categoryId: Number,
    name: string,
    image: string,
    description: string,
    price: number,
    stock: number
  },
  order: {
    id: Number,
    transactionId: Number,
    productId: Number,
    count: number,
    product: Product[]
  },

}

interface SellerTransactions {
  sellerTransactions: Shop
}

interface Shop {
  id: Number,
  shopName: string,
  averageRating: Number,
  balance: number
  transaction: Transaction[]
}

interface Transaction {
  id: number,
  userId: number,
  shopId: number,
  status: string,
  paymentMethod: string,
  order: Order[],
  user: User
}

interface User {
  id: number,
  name: string,
  email: string,
  image: string,
  profile: Profile
}

interface Profile {
  id: number,
  userId: number,
  username: string,
  phoneNumber: string
}

interface Order {
  id: number,
  transactionId: number,
  productId: number,
  count: number,
  rating: Rating,
  complain: Complain
  product: Product
}

interface Rating {
  id: number,
  orderId: number,
  comment: string,
  rate: string,
  image: string
}

interface Complain {
  id: number,
  orderId: number,
  status: string,
  description: string,
  ShopComment: string,
  image: string
}

interface Product {
  id: number,
  shopId: number,
  categoryId: number,
  name: string,
  image: string,
  description: string,
  price: number,
  stock: number
}

export default function Profile({ shop, product, order }: Props) {

  const router = useRouter()
  const { data: session } = useSession();
  let count = 0;
  const kecoa = [];

  const statusMap: Record<string, Array<any>> = {
    UNPAID: [],  // Inisialisasi array kosong untuk status "UNPAID"
    PAID: [],  // Inisialisasi array kosong untuk status "PAID"
    REFUNDED: [],  // Inisialisasi array kosong untuk status "REFUNDED"
    INCART: [],  // Inisialisasi array kosong untuk status "INCART"
    AWAITING_CONFIRMATION: [],  // Inisialisasi array kosong untuk status "AWAITING_CONFIRMATION"
    PACKING: [],  // Inisialisasi array kosong untuk status "PACKING"
    DELIVERING: [],  // Inisialisasi array kosong untuk status "DELIVERING"
    FINISHED: [],  // Inisialisasi array kosong untuk status "FINISHED"
    RETURNING: [],  // Inisialisasi array kosong untuk status "RETURNING"
    NEED_ADMIN_REVIEW: [],  // Inisialisasi array kosong untuk status "NEED_ADMIN_REVIEW"
    RETURNED: [],  // Inisialisasi array kosong untuk status "RETURNED"
    RETURN_REJECTED: [],  // Inisialisasi array kosong untuk status "RETURN_REJECTED"
    CANCELING: [],  // Inisialisasi array kosong untuk status "CANCELING"
    CANCELED: [],  // Inisialisasi array kosong untuk status "CANCELED"
    CANCEL_REJECTED: [],  // Inisialisasi array kosong untuk status "CANCEL_REJECTED"
  };

  // const renderTransaction = () => {
  //   return Object.keys(statusMap).map((status) => {
  //     return (
  //       <Agungageng 
  //         activeTab={activeTab},
  //         statusMap={statusMap},
  //       />
  //     )
  //   })
  // }

  // console.log(`status1`, statusMap.PAID)
  // console.log(`status2`, statusMap.PAID.map((kebo)=>
  //   kebo
  // ))
  // console.log(`status3`, Object.keys(statusMap).map((status) => (status[0])))
  console.log(`status`, Object.keys(statusMap).map((status)=>{
    statusMap[status].map((badak)=>(
      badak.id
    ))
  }))

  // const [selectedStatus, setSelectedStatus] = useState(statusMap)
  const [activeTab, setActiveTab] = useState('UNPAID');
  const [isSalesDropdownClosed, setIsSalesDropdownClosed] = useState<boolean>(true);
  const [pesanan, setPesanan] = useState([])

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(shop.balance).toString();


  const handleTabClick = (status: keyof typeof statusMap) => {
    setActiveTab(status);
    setIsSalesDropdownClosed(true)
  };

  // const renderActionButtons = () => { //TODO: REFACTOR THIS SWITCH CASE CODE SMELL

  //   const detailTransaksiButton = () => {
  //     return (
  //       <button onClick={() => onDetail(transaction)} className="flex justify-center items-center text-xs lg:text-base w-28 lg:w-32 h-8 border-2 border-green-500 text-green-500">
  //         Detail Transaksi
  //       </button>
  //     );
  //   }

  //   const renderExtraActionDropdown = () => { //THIS STILL CAUSES A BUG. If you enter web-view mode, and click various extra action buttons consecutively, then enter mobile mode, there will be a stack of extra actions modal
  //     return(
  //       <div className="">
  //         <button id="extra-actions-mobile" onClick={() => setExtraActionsIsOpen(!extraActionsIsOpen)} className="lg:hidden w-8 h-8 flex justify-center items-center bg-black">
  //           <HiOutlineEllipsisVertical className="text-white"/>
  //         </button>
  //         <div id="extra-actions-web-view" className="hidden lg:block dropdown dropdown-end">
  //           <label onClick={() => setExtraActionsIsOpen(true)} tabIndex={0} className="w-8 h-8 flex justify-center items-center bg-black hover:cursor-pointer">
  //             <HiOutlineEllipsisVertical className="text-white"/>
  //           </label>
  //           <ul tabIndex={0} className="mt-1 dropdown-content menu shadow bg-base-100 rounded-sm w-52">
  //             <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Tanya Penjual</a></li>
  //             { //I really need to refactor this entire module
  //               (transaction.status === TransactionStatus.UNPAID||transaction.status === TransactionStatus.AWAITING_CONFIRMATION || transaction.status === TransactionStatus.PACKING) 
  //               ? <li className="rounded-sm hover:bg-gray-100 transition duration-300">
  //                   <label onClick={() => onCancel(transaction)} htmlFor="cancel-alert">
  //                   Batalkan
  //                   </label>
  //                 </li>
  //               // : <li className="rounded-sm hover:bg-gray-100 transition duration-300"><div onClick={()=>onReturn(transaction.id)}>Ajukan Komplain</div></li>
  //               : <li className="rounded-sm hover:bg-gray-100 transition duration-300"><div>Ajukan Komplain</div></li>
  //             }
  //             <li className="rounded-sm hover:bg-gray-100 transition duration-300"><a>Pusat Bantuan</a></li>
  //           </ul>
  //         </div>
  //       </div>
  //     );
  //   }

  //   //better idea: Create a callback function argument that passes all the handle functions and buttons to render as objects and render them there

  //   if(transaction.status === TransactionStatus.UNPAID){
  //     return (
  //       <>
  //         <label htmlFor="payment-modal" onClick={() => onBayar(transaction)} className="text-xs lg:text-base flex justify-center items-center w-24 h-8 text-white bg-green-500 hover:cursor-pointer">
  //           Bayar
  //         </label>
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }
  //   if (transaction.status === TransactionStatus.AWAITING_CONFIRMATION){
  //     return (
  //       <>
  //         {detailTransaksiButton()}
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }
  //   else if (transaction.status === TransactionStatus.FINISHED){ // FINISHED == SUCCESS
  //     return (
  //       <>
  //         {detailTransaksiButton()}
  //         {/* <label htmlFor="review-modal" onClick={onRateClick} className="flex justify-center items-center text-xs lg:text-base w-32 text-white bg-green-500 hover:cursor-pointer">
  //           Ulas Produk
  //         </label> */}
  //         <div className="flex justify-center items-center text-xs lg:text-base w-32 text-white bg-green-500 hover:cursor-pointer">
  //           Ulas Produk
  //         </div>
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }
  //   else if (transaction.status === TransactionStatus.CANCELED || transaction.status === TransactionStatus.CANCEL_REJECTED){
  //     return (
  //       <>
  //         {detailTransaksiButton()}
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }
  //   else if (transaction.status === TransactionStatus.PACKING){
  //     return (
  //       <>
  //         {detailTransaksiButton()}
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }
  //   else if (transaction.status === TransactionStatus.DELIVERING){
  //     return (
  //       <>
  //         {detailTransaksiButton()}
  //         <button onClick={(e) => e.preventDefault()} className="text-xs lg:text-base w-32 text-white bg-green-500">
  //           Lacak
  //         </button>
  //         {renderExtraActionDropdown()}
  //       </>
  //     );
  //   }

  //   return <>
  //     {renderExtraActionDropdown()}
  //   </>;
  // }

  // let indexTrans = shop.transaction

  // let priceMap = shop.transaction.map((trans) => (
  //   trans.order.map((oor) => (
  //     oor.product.price
  //   ))
  // ))

  // let priceMap = indexTrans?.order.map((trans) => (
  //     trans.product.price
  // ))

  // let priceMap = shop.transaction.map((ccd)=>(
  //   ccd.order
  // ))

  // let total = 0
  // const ngitung = () => {
  //   priceMap?.forEach((totalPrice) => {
  //     for (let val = 0; val < totalPrice.length; val++) {
  //       total += totalPrice[val];
  //     }
  //   })
  //   return total
  // }



  // const renderExtraItems = () => {
  //   // let mapping = {statusMap[status].length > 0}
  //   let count = 0
  //   shop.transaction.forEach((trans) => {
  //     trans.order.forEach((orders) => {
  //       count += Number(orders.length)
  //     })
  //     if (count === 1) {
  //       return <></>
  //     } else {
  //       return <>
  //         <h1 className="text-xs lg:text-base">+{count - 1} Produk Lainnya</h1>
  //       </>
  //     }
  //   })
  // }


  const renderSalesModal = () => {
    return (
      <div hidden={isSalesDropdownClosed} id="sales-bottom-modal" className="lg:hidden align-bottom bg-gray-900 bg-opacity-75 fixed w-full h-full -top-2 right-0 left-0 bottom-0 z-50">
        <div className="h-1/2" onClick={() => setIsSalesDropdownClosed(true)}>
          {/* This exists just so that the content gets pushed down. I could do without having this div, but it would require flex and align-bottom to do so and the modal would still appear despite closing it*/}
        </div>
        <div id="berlangsung-modal-box" className="p-2 bg-white h-1/2 w-full rounded-lg overflow-y-hidden overscroll-contain">
          <div id="main-menu-modal-x-container" className="flex flex-row space-x-2">
            <button onClick={() => setIsSalesDropdownClosed(true)} className="font-bold text-2xl">✕</button>
            <h1 className="font-bold text-2xl">Sales</h1>
          </div>
          <div id="berlangsung-modal-content">
            <ul>
              {Object.keys(statusMap).map((status) => (
                <li
                  key={status}
                  className={`flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 ${activeTab === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} focus:outline-none`}
                  onClick={() => handleTabClick(status)}
                >
                  {status}
                </li>
              ))}
              {/* <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Waiting Confirmation
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Ongoing
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Finish
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Return
                  </h1>
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    );
  }






  const sellList = shop.transaction;  // Mendapatkan nilai `sellList` dari `shop.transaction`

  const mapMap = sellList.map((kera) => ({
    value: kera.status
  }))

  if (sellList) {  // Memeriksa apakah `sellList` tidak null atau undefined

    sellList.forEach((item) => {  // Melakukan iterasi pada setiap item dalam `sellList`
      if (item.status in statusMap) {  // Memeriksa apakah status item ada dalam `statusMap`
        statusMap[item.status].push(item);  // Menambahkan item ke array yang berkorespondensi dengan status tersebut
      }
    });

    Object.values(statusMap).forEach((statusArray) => {  // Melakukan iterasi pada setiap array status dalam `statusMap`
      // console.log(statusArray);  // Mencetak setiap array status menggunakan `console.log`
    });
  }

  if (!shop) {
    router.push('/shop/register')
  } else {
    console.log(`shop`, shop)
    console.log(`first product`, product)
    console.log(`order bang`, order)
    // console.log(`statusMap`, statusMap.PAID)
    // console.log(`displaynya`, selectedStatus.status)
    // console.log(`statusmap.paid`, statusMap.PAID[0].status)
    // console.log(`active`, activeTab)
    // console.log(`price`, price)
    // console.log(`apaan nih`, priceMap)
    // console.log(`calculated`, ngitung())
    console.log(`length`, sellList[5].order.length)

    console.log(`shop2`, shop.transaction)


    console.log(`extraItems`, shop.transaction.map((gg) => (
      gg.order.length as number
    )))
    // console.log(`orders`, firstOrder)
    return (
      <div className='-m-4'>
        <div className='hidden lg:block'>
          <Navbar />
        </div>
        {/* <h1 className="text-xs">Rp {calculateTransactionTotal().toString()}</h1> */}
        <div className='lg:flex lg:flex-row py-4 space-x-2'>
          {/* <ShopDashboard shop={transaction.status} /> */}
          <div id='product-list' className=' w-full bg-gray-100 py-5'>

            <div>
              <div className='lg:flex lg:flex-row gap-x-4'>
                {/* {Object.keys(statusMap).map((status) => (
                  <button
                    key={status}
                    className={`px-4 py-2 block text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 ${activeTab === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} focus:outline-none`}
                    onClick={() => handleTabClick(status)}
                  >
                    {status}
                  </button>
                ))} */}

                <div id='shop-dashboard' className="lg:hidden bg-transparent lg:bg-gray-300 lg:shadow-md lg:w-1/6 h-min lg:sticky lg:top-24"> {/*Try to use drawer here*/}
                  <div id="shop-profile" className="bg-gray-300 flex flex-row lg:flex-col">
                    <div id="photo-and-details-container" className="bg-gray-300 flex flex-row lg:flex-col justify-start lg:justify-center items-center px-4 lg:px-2 py-4 lg:space-y-2 space-x-4 lg:space-x-0">
                      <div id="profile-photo-container" className="">
                        <div className="w-16 lg:w-24 rounded-full border border-black">
                          <img src={session?.user.image!} alt="" className="rounded-full" />
                        </div>
                      </div>
                      <div id="shop-details-container" className="flex flex-col items-start lg:items-center lg:space-y-1">
                        <h1 className="font-bold">{shop.shopName}</h1>
                        <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
                        <button className="hidden lg:block rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
                          <Link href={'/shop/profile'} className="flex justify-center items-center">
                            Edit Toko
                          </Link>
                        </button>
                        <h1 className="text-sm lg:hidden">Kas: {formatKas()}</h1>
                      </div>
                    </div>
                  </div>
                  <div id="shop-stats" className="bg-gray-300 invisible lg:visible lg:py-2 lg:px-4 h-2 lg:h-auto border border-y-gray-600">
                    <h1 className="">Kas: {formatKas()}</h1>
                  </div>
                  <div id="shop-dashboard-navigation" className="lg:p-2 lg:bg-gray-300">
                    <ul className="flex flex-row overflow-y-auto space-x-2 lg:space-x-0 lg:flex-col">
                      <li className="bg-gray-300 lg:bg-none">
                        <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiHome className="h-6 w-6" />
                          <span className="ml-3">Home</span>
                        </Link>
                      </li>
                      <li className="bg-gray-300 lg:bg-none">
                        <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiChatBubbleBottomCenterText className="h-6 w-6" />
                          <span className="ml-3">Chat</span>
                        </Link>
                      </li>
                      <li id="sales-mobile-version" className="lg:hidden bg-gray-300 lg:bg-none">
                        <button onClick={() => { setIsSalesDropdownClosed(false) }} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300">
                          <HiCurrencyDollar className="h-6 w-6" />
                          <span className="flex-1 ml-3 text-left">Sales</span>
                          {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6" /> : <HiChevronUp className="h-6 w-6" />}
                        </button>
                      </li>
                      <li id="sales-web-version" className="hidden lg:block bg-gray-300 lg:bg-none">
                        <button type="button" onClick={() => setIsSalesDropdownClosed(!isSalesDropdownClosed)} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300">
                          <HiCurrencyDollar className="h-6 w-6" />
                          <span className="flex-1 ml-3 text-left">Sales</span>
                          {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6" /> : <HiChevronUp className="h-6 w-6" />}
                        </button>
                        <ul id="sales-ul-dropdown" hidden={isSalesDropdownClosed.valueOf()} className="transition duration-75 bg-gray-200">
                          <li>
                            <Link href={'/shop/orders'} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                              Orders
                            </Link>
                          </li>
                          <li>
                            <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                              Complaints
                            </Link>
                          </li>
                          <li>
                            <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                              Reviews
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="bg-gray-300 lg:bg-none">
                        <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiChartPie className="h-6 w-6" />
                          <span className="ml-3">Stats</span>
                        </Link>
                      </li>
                      <li className="bg-gray-300 lg:bg-none">
                        <Link href={'/shop/withdrawals'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiChatBubbleBottomCenterText className="h-6 w-6" />
                          <span className="ml-3">Withdraw</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {renderSalesModal()}

                {/* <div id='dashboard-content' className='lg:hidden lg:w-1/5 bg-gray-100 lg:p-5 space-y-2'>
                  <h1 className='hidden lg:block text-2xl'>Seller Home</h1>
                  <div id='new-item-input-container' className='lg:grid lg:grid-cols-5 w-full' >
                    <div id="shop-profile" className="flex flex-col justify-center items-center px-2 py-4 space-y-2">
                    <div id="profile-photo-container" className="avatar">
                      <div className="w-24 rounded-full border border-black">
                        <img src={session?.user.image!} alt="" />
                      </div>
                    </div>
                    <h1 className="font-bold">{shop.shopName}</h1>
                    <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
                    <button className="rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
                      <Link href={'/shop/profile'} className="flex justify-center items-center">
                        Edit Toko
                      </Link>
                    </button>
                  </div>
                  </div>
                  <div id='product-list' className='flex flex-row overflow-y-auto space-x-4 lg:space-x-0 lg:grid lg:grid-cols-5 lg:gap-y-10 w-full'>
                    {Object.keys(statusMap).map((status) => (
                      <li
                        key={status}
                        className={`flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 ${activeTab === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} focus:outline-none`}
                        onClick={() => handleTabClick(status)}
                      >
                        {status}
                      </li>
                    ))}
                  </div>
                </div> */}



                <div id='shop-dashboard' className="lg:sticky lg:top-0 hidden lg:block lg:shadow-md lg:w-1/5 ">
                  <div id="shop-profile" className="flex flex-col justify-center items-center px-2 py-4 space-y-2">
                    <div id="profile-photo-container" className="avatar">
                      <div className="w-24 rounded-full border border-black">
                        <img src={session?.user.image!} alt="" />
                      </div>
                    </div>
                    <h1 className="font-bold">{shop.shopName}</h1>
                    <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
                    <button className="rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
                      <Link href={'/shop/profile'} className="flex justify-center items-center">
                        Edit Toko
                      </Link>
                    </button>
                  </div>
                  <div id="shop-stats" className="py-2 px-4 border border-y-gray-600">
                    <h1>Kas: {formatter.format(shop.balance)}</h1>
                  </div>
                  <div id="shop-dashboard-navigation" className="p-2">
                    <ul className="">
                      <li>
                        <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiHome className="h-6 w-6" />
                          <span className="ml-3">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiChatBubbleBottomCenterText className="h-6 w-6" />
                          <span className="ml-3">Chat</span>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/shop/products'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiShoppingBag className="h-6 w-6" />
                          <span className="ml-3">Products</span>
                        </Link>
                      </li>
                      <li>
                        <button type="button" onClick={() => setIsSalesDropdownClosed(false)} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300" >
                          <HiCurrencyDollar className="h-6 w-6" />
                          <span className="flex-1 ml-3 text-left">Sales</span>
                          {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6" /> : <HiChevronUp className="h-6 w-6" />}
                        </button>
                        <ul id="sales-ul-dropdown" hidden={isSalesDropdownClosed.valueOf()} className="transition duration-75 bg-gray-200">
                          {Object.keys(statusMap).map((status) => (
                            <li
                              key={status}
                              className={`flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 ${activeTab === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} focus:outline-none`}
                              onClick={() => handleTabClick(status)}
                            >
                              {status}
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                          <HiChartPie className="h-6 w-6" />
                          <span className="ml-3">Stats</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='w-full'>

                  {Object.keys(statusMap).map((status) => (
                    <div key={status} className={`${activeTab === status ? '' : 'hidden'}`}>
                      {statusMap[status].length > 0 ? (
                        <>
                          {statusMap[status].map((kodok) => (
                            <div key={kodok.id} className="my-4">
                              <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
                                <div className="w-1/2 flex justify-start items-center ">
                                  <h1 className="text-sm lg:text-xl font-bold">{kodok.user.profile?.username ? kodok.user.profile?.username! : kodok.user.name}</h1>
                                </div>
                                <div className="w-1/2 flex flex-col lg:flex-row lg:items-center lg:space-x-2 justify-end">
                                  <h1>{activeTab == "AWAITING_CONFIRMATION" ? "Otomatis Batal" : activeTab}</h1>
                                </div>
                              </div>
                              <div id="lower-detail">
                                {kodok.order.map((kecoa: any) => (
                                  <>
                                    <div key={kecoa.id} id="product-details" className="flex flex-row p-2 bg-gray-300">
                                      <div id="product-detail-img-container" className=" flex justify-center items-center">
                                        <Image
                                          alt={`Product nama`}
                                          src={`http://localhost:3000/${kecoa.product.image.split(",")[0]}`}
                                          width={800}
                                          height={400}
                                          quality={70}
                                          className='w-36 h-36 object-cover'
                                          onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                                          }}
                                        />
                                      </div>
                                      <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
                                        <h1 className="text-xs lg:text-base">Kode Transaksi: {kodok.id} </h1>
                                        <div>
                                          <h1 className="text-xs lg:text-base font-bold">
                                            {kecoa.product.name}
                                          </h1>
                                          <h1 className="text-xs lg:text-base">Jumlah: {kecoa.count}</h1>
                                        </div>
                                        {(kodok.order.length as number === 1 ? <></> : <h1 className="text-xs lg:text-base">{kodok.order.length as number - 1} Produk lainnya</h1>)}
                                      </div>
                                      <div id="total-details-lower" className="hidden lg:flex lg:flex-col lg:justify-center w-1/3 p-4 space-y-2 border-l-gray-500 border-l-2">
                                        <h1 className="">Total Belanja</h1>
                                        <h1 className="font-bold">Rp 10000</h1>
                                      </div>
                                    </div>
                                  </>
                                ))}
                                <div id="total-section" className="flex flex-row p-2 bg-gray-400">
                                  <div id="total-details" className="w-1/3 lg:hidden">
                                    <h1 className="text-xs">Total Belanja</h1>
                                    <h1 className="text-xs">Rp 10000</h1>
                                  </div>
                                  <div className="w-1/3 hidden lg:flex lg:flex-row lg:justify-start lg:items-center">
                                    <HiShoppingCart className="mr-1" />
                                    renderTransactionDate
                                  </div>
                                  <div id="transaction-actions" className="w-2/3 lg:w-full flex flex-row justify-end space-x-2">
                                    renderActionButtons
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>Tidak ada data untuk status `{status}`</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const shop2 = await prisma.shop.findUnique({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      shopName: true,
      averageRating: true,
      balance: true,
      transaction: {
        select: {
          id: true,
          userId: true,
          shopId: true,
          status: true,
          paymentMethod: true,
          order: {
            select: {
              id: true,
              transactionId: true,
              productId: true,
              count: true,
              Rating: {
                select: {
                  id: true,
                  oderId: true,
                  comment: true,
                  rate: true,
                  image: true
                }
              },
              Complain: {
                select: {
                  id: true,
                  oderId: true,
                  status: true,
                  description: true,
                  ShopComment: true,
                  image: true
                }
              },
              product: {
                select: {
                  id: true,
                  shopId: true,
                  categoryId: true,
                  name: true,
                  image: true,
                  description: true,
                  price: true,
                  stock: true,
                },
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profile: {
                select: {
                  id: true,
                  userId: true,
                  username: true,
                  phoneNumber: true
                }
              }
            }
          }
        }
      }
    }
  })

  // const transactionList = await prisma.transaction.findMany({
  //   where: {
  //     shopId: shop2?.id
  //   },
  //   // include:{
  //   //   order:{
  //   //     include: {
  //   //       product: true
  //   //     }
  //   //   }
  //   // }
  // })
  // const orderList = await prisma.order.findFirst({
  //   // take: 1,
  //   where: {
  //     transactionId: transactionList?.id
  //   },
  //   select: {
  //     id: true,
  //     transactionId: true,
  //     productId: true,
  //     count: true,
  //     product: true
  //   }
  // })

  // const productList = await prisma.product.findFirst({
  //   take: 1,
  //   where: {
  //     shopId: transactionList?.shopId
  //   },
  //   select: {
  //     id: true,
  //     shopId: true,
  //     categoryId: true,
  //     name: true,
  //     image: true,
  //     description: true,
  //     price: true,
  //     stock: true
  //   }
  // })


  // const takeId  = shop2?.transaction.length

  // const dateMap = shop.map((asw)=> ({
  //   ...asw,
  //   transaction: {
  //     ...asw.transaction,
  //     order:{()
  //       ...asw.transaction.order
  //     }
  //     // Rating:{
  //     //   ...asw.order.Rating
  //     // }
  //   },
  // createdAt: asw.createdAt.toISOString(),
  // updatedAt: asw.updatedAt.toISOString()
  // }))
  // const firstOrder = shop2?.transaction.map((trans) => (
  //   trans.order.map((orders) => (
  //     orders
  //   ))
  // ))
  // const orders = firstOrder?.product[firstOrder.product.length - 1]
  // console.log('shop2', shop2?.transaction)
  return {
    props: {
      shop: JSON.parse(JSON.stringify(shop2)),
      // transaction: JSON.parse(JSON.stringify(transactionList))
      // product: JSON.parse(JSON.stringify(productList)),
      // order: JSON.parse(JSON.stringify(orderList))
    },
  }
  // finishedOrders: JSON.parse(JSON.stringify(finishedOrders))
}