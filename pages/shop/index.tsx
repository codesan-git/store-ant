import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import ProductCard from '@/components/product_card'
import Navbar from '../navbar'
import Footer from '../footer'
import ShopDashboard from '../../components/shop/shop_dashboard'

interface Props{
    shop:{
        id: Number,
        shopName: string,
        averageRating: Number
    }
    products:{
      id: string,
      name: string,
      price: number,
      stock: number,
      category: Category,
      image: string,
      averageRating: number
    }[]
}

interface Category{
  id: Number,
  category: string
}

export default function Profile({shop, products} : Props) {

  const router = useRouter()
  const{data:session} = useSession();

  
  if(!shop){
    router.push('/shop/register')
  }else{
    return (
      <>
      <Navbar />
        <div className='flex mx-10 my-10 space-x-4'>
            <ShopDashboard shop={shop}/>
            <div id='product-list' className='w-full bg-gray-100 py-5'>
                
            </div>
        </div>
        <Footer />
        </>
      )
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const shop = await prisma.shop.findUnique({
        where: { userId: session?.user?.id },
        select:{
            id: true,
            shopName: true,
            averageRating: true
        }
    })
    const products = await prisma.product.findMany({
        where:{shopId: shop?.id},
        select:{
          id: true,
          name: true,
          price: true,
          stock: true,
          category: true,
          image: true,
          averageRating: true,
        },
        orderBy: [
          {
            id: 'asc',
          }
        ],
    })
    return { props: {shop, products} }
}