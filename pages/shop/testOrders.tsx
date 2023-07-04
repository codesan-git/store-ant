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
  HiChevronUp
} from "react-icons/hi2";

interface Props {
  shop: {
    id: Number,
    shopName: string,
    averageRating: Number,
    balance: number
    transaction: Transaction[]
  },
  transaction: {
    status: string
  }
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

export default function Profile({ shop }: { shop: Shop }, { transaction }: Props) {

  const router = useRouter()
  const { data: session } = useSession();

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

  // const [selectedStatus, setSelectedStatus] = useState(statusMap)
  const [activeTab, setActiveTab] = useState('UNPAID');
  const [isSalesDropdownClosed, setIsSalesDropdownClosed] = useState<boolean>(true);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(shop.balance).toString();


  const handleTabClick = (status: keyof typeof statusMap) => {
    setActiveTab(status);
    setIsSalesDropdownClosed(true)
  };

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
    // console.log(`statusMap`, statusMap.PAID)
    // console.log(`displaynya`, selectedStatus.status)
    // console.log(`statusmap.paid`, statusMap.PAID[0].status)
    console.log(`active`, activeTab)




    return (
      <div className='-m-4'>
        <div className='hidden lg:block'>
          <Navbar />
        </div>
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
                          <h1>{activeTab}</h1>
                          {statusMap[status].map((kodok) => (
                            <div key={kodok.id}>
                              <div className='border-4 bg-blue-gray-400'>
                                <h2>Nama Pembeli: {kodok.user.profile?.username ? kodok.user.profile?.username! : kodok.user.name}</h2>
                              </div>
                              <div className='grid grid-cols-4'>
                                <div className='col-span-3'>
                                  <div className='grid grid-cols-5'>
                                    <div className='col-span-1'>
                                      {kodok.order.map((kecoa: any) => (
                                        <Image
                                          key={kecoa.id}
                                          alt={`Product ${kecoa.product.name}`}
                                          src={`http://localhost:3000/${kecoa.product.image.split(",")[0]}`}
                                          width={800}
                                          height={400}
                                          quality={70}
                                          className='w-full sm:p-2 lg:p-6'
                                        />
                                      ))}
                                    </div>
                                    <div className='col-span-4 sm:py-2 lg:py-6'>
                                      {kodok.order.map((kerang: any) => (
                                        <div key={kerang.id}>
                                          <p>Kode Transaksi: {kerang.transactionId}</p>
                                          <p>
                                            <b>{kerang.product.name}</b>
                                          </p>
                                          <p>Qty: {kerang.count}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p>komen bang</p>
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
                  stock: true
                }
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

  const transactionList = await prisma.shop.findUnique({
    where: {
      userId: session?.user?.id
    },
    include: {
      transaction: {
        select: {
          status: true
        }
      }
    }
  })

  // const dateMap = shop.map((asw)=> ({
  //   ...asw,
  //   transaction: {
  //     ...asw.transaction,
  //     order:{
  //       ...asw.transaction.order
  //     }
  //     // Rating:{
  //     //   ...asw.order.Rating
  //     // }
  //   },
  // createdAt: asw.createdAt.toISOString(),
  // updatedAt: asw.updatedAt.toISOString()
  // }))
  return {
    props: {
      shop: JSON.parse(JSON.stringify(shop2)),
      transaction: JSON.parse(JSON.stringify(transactionList))
    },
  }
  // finishedOrders: JSON.parse(JSON.stringify(finishedOrders))
}