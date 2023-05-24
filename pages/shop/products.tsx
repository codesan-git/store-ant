import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { prisma } from "../../lib/prisma";
import Link from 'next/link';
import ProductCard from '@/pages/components/product_card';
import Navbar from '../navbar';
import Footer from '../footer';
import ShopDashboard from '../components/shop/shop_dashboard';

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

const Products = ({shop, products} : Props) => {
  const router = useRouter()
  const{data:session} = useSession()

  async function deleteProduct(id:string) {
    try{
      fetch(`http://localhost:3000/api/product/${id}`, {
        body: JSON.stringify(id),
          headers: {
              'Content-Type' : 'application/json'
          },
        method: 'DELETE'
      }).then(()=>{
        router.replace(router.asPath)
      })
    }catch(error){
        //console.log(error)
    }
  }

  const editProduct = (id: string) => router.push({pathname: '/product/update', query: { id: id }});

  
  if(!shop){
    router.push('/shop/register')
  }else{
    return (
      <>
      <Navbar />
        <div className='flex mx-10 my-10 space-x-4'>
            <ShopDashboard shop={shop}/>
            {/* <div id='shop-dashboard' className='w-1/6 ml-5 -mt-10'>
                <div className='text-center justify-center mt-10'>
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src={session?.user?.image!} width="300" height="300" />
                        </div>
                    </div>
                    <div className='details font-bold text-lg'>
                        <h5>{shop.shopName}</h5>
                        <p>Rating: {String(shop.averageRating)}/ 5</p>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                    <ul className="menu p-4 w-full bg-base-100 text-base-content">
                    <li><Link href="/shop">Profile</Link></li>
                    <li><Link href="">Products</Link></li>
                    <li><Link href="/shop/orders">Orders</Link></li>
                    <li><Link href="/shop/stats">Stats</Link></li>
                    </ul>
                </div>
            </div> */}
            <div id='product-list' className='w-full bg-gray-100 py-5'>
                <section className="w-4/5 mx-auto flex flex-col gap-10">
                    <div className="title">
                    <div className='flex'>
                        <h1 className="text-gray-800 text-4xl font-bold py-4">Products</h1>
                        <div className='ml-auto my-auto'>
                        <Link className='px-10 py-2 rounded-sm bg-indigo-500 text-gray-50' href={'/product/create'}>Add Product</Link>
                        </div>
                    </div>
                    <p className="mx-auto text-gray-400">products on your shop</p>
                    </div>
                </section>
                <div className='w-4/5 py-5 mx-auto flex-col grid lg:grid-cols-3 gap-10'>
                    {products.map(product =>(
                          <ProductCard product={product} onEdit={editProduct} onDelete={deleteProduct} key={product.id}/>                        
                    ) )}
                </div>
            </div>
        </div>
        <Footer />
        </>
      )
  }
}

export default Products;

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