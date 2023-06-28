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
import ProductItem from '@/components/shop/product_item'

interface Props{
    shop:{
        id: Number,
        shopName: string,
        averageRating: Number,
        balance: number
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
      <div>
        <Navbar />
        <div className='lg:flex lg:flex-row py-4 space-x-2'>
          <ShopDashboard shop={shop}/>
          <div id='dashboard-content' className='w-full bg-gray-100 p-5 space-y-2'>
            <h1 className='text-2xl'>Seller Home</h1>
            <div  id='new-item-input-container'className='lg:grid lg:grid-cols-5 w-full' >
              <div id='new-item-input' className='border-dashed border-2 border-black p-2 w-5/6 h-10 flex justify-center items-center'>
                <h1>{'(+) New Item'}</h1>
              </div>
            </div>
            <div id='product-list' className='flex flex-row overflow-y-auto lg:grid lg:grid-cols-5 lg:gap-y-10 w-full'>
              <ProductItem/>
              <ProductItem/>
              <ProductItem/>
              <ProductItem/>
              <ProductItem/>
              <ProductItem/>
            </div>
          </div>
        </div>
        <Footer />
      </div>
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
            averageRating: true,
            balance: true
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