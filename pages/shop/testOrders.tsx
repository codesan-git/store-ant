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

interface Props {
  shop: {
    id: number,
    shopName: string,
    averageRating: number,
    balance: number
    transaction: Transaction[]
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

export default function Profile({ shop }: Props) {

  const router = useRouter()
  const { data: session } = useSession();

  const [selectedTransaction, setSelectedTransaction] = useState<SellerTransactions>();
  const [isCancelling, setIsCancelling] = useState<boolean>();


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

  const [selectedStatus, setSelectedStatus] = useState("")

  const sellList = shop.transaction;  // Mendapatkan nilai `sellList` dari `shop.transaction`

  if (sellList) {  // Memeriksa apakah `sellList` tidak null atau undefined

    sellList.forEach((item) => {  // Melakukan iterasi pada setiap item dalam `sellList`
      if (item.status in statusMap) {  // Memeriksa apakah status item ada dalam `statusMap`
        statusMap[item.status].push(item);  // Menambahkan item ke array yang berkorespondensi dengan status tersebut
      }
    });

    Object.values(statusMap).forEach((statusArray) => {  // Melakukan iterasi pada setiap array status dalam `statusMap`
      console.log(statusArray);  // Mencetak setiap array status menggunakan `console.log`
    });
  }

  if (!shop) {
    router.push('/shop/register')
  } else {
    console.log(`shop`, shop)
    console.log(`statusMap`, statusMap.PAID)
    return (
      <div>
        <Navbar />
        <div className='flex flex-row py-4 space-x-2'>
          <ShopDashboard shop={shop} />
          <div id='product-list' className='w-full bg-gray-100 py-5'>
            <h1 className='text-black'>PAID</h1>
            {
              statusMap.PAID.map((kodok) => (
                <>
                  <div>
                    <div className='border-4 bg-blue-gray-400'>
                      <h2>Nama Pembeli: {kodok.user.profile?.username ? kodok.user.profile?.username! : kodok.user.name}</h2>
                    </div>
                    <div className='grid grid-cols-4'>
                      <div className='col-span-3'>
                        <div className='grid grid-cols-5'>
                          <div className='col-span-1'>
                            {
                              kodok.order.map((kecoa: any) =>
                                <>
                                  <Image
                                    alt={`Product ${kecoa.product.name}`}
                                    src={`http://localhost:3000/${kecoa.product.image.split(",")[0]}`}
                                    width={800}
                                    height={400}
                                    quality={70}
                                    // style={{width:"1200px"}}
                                    className='w-full sm:p-2 lg:p-6'
                                  />
                                </>
                              )
                            }
                          </div>

                          <div className='col-span-4 sm:py-2 lg:py-6'>
                            {
                              kodok.order.map((kerang:any) =>
                                <>
                                  <p>{kerang.transactionId}</p>
                                  <p><b>{kerang.product.name}</b></p>
                                  <p>Qty: {kerang.count}</p>
                                </>
                              )
                            }
                          </div>

                        </div>
                      </div>
                      <div>
                        <p>komen bang</p>
                      </div>
                    </div>
                  </div>
                </>
              ))
            }
          </div>
        </div>
        <Footer />
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
  return { props: { shop: JSON.parse(JSON.stringify(shop2)) } }
  // finishedOrders: JSON.parse(JSON.stringify(finishedOrders))
}