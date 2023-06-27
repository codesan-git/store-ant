import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import ProductCard from '@/components/index/product_card';
import Navbar from '../navbar'
import Footer from '../footer'
import ShopDashboard from '../../components/shop/shop_dashboard'


// interface Props {
//   shop:{
//     id: Number,
//     shopName: string,
//     averageRating: Number,
//     balance: number,
//   }
//   shop2:{
//     id: Number,

//   }
// }
interface Props {
  shop: {
    id: number,
    shopName: string,
    averageRating: number,
    balance: number
    transaction: Transaction[]
  }
  // transaction: {
  //   id: number,
  //   userId: number,
  //   shopId: number,
  //   status: string,
  //   paymentMethod: string,
  //   order: Order
  // }
  // order: {
  //   id: number,
  //   transactionId: number,
  //   productId: number,
  //   count: number,
  //   rating: Rating,
  //   complain: Complain
  // }
  // rating: {
  //   id: number,
  //   orderId: true,
  //   comment: true,
  //   rate: true,
  //   image: true
  // }
  // complain: {
  //   id: number,
  //   orderId: number,
  //   status: string,
  //   description: string,
  //   ShopComment: string,
  //   image: string
  // }
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
  order: Order[]
}

// interface Category{
//   id: Number,
//   category: string
// }

interface Order {
  id: number,
  transactionId: number,
  productId: number,
  count: number,
  rating: Rating,
  complain: Complain
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

export default function Profile({ shop }: Props) {
  // export default function Profile({ id }: Shop) {

  const router = useRouter()
  const { data: session } = useSession();

  if (!shop) {
    router.push('/shop/register')
  } else {
    console.log(`shop`, shop)
    return (
      <div>
        <Navbar />
        <div className='flex flex-row py-4 space-x-2'>
          <ShopDashboard shop={shop} />
          <div id='product-list' className='w-full bg-gray-100 py-5'>
            {shop.transaction.map((kodok) => (
              <>
                <div className='text-red-500'>
                  {kodok.id}
                </div>
                <h2>
                  {kodok.status}
                </h2>
                {kodok.order.map((mantep)=>(
                  <>
                    <p>
                      {mantep.id}
                    </p>
                    <p className='text-blue-800'>
                      {mantep.productId}
                    </p>
                  </>
                ))}
              </>
            ))}
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