import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'

interface Props{
    shop:{
        id: Number,
        shopName: string
    }
    products:{
      id: string,
      name: string,
      price: number,
      stock: number,
      category: Category,
      image: string
    }[]
}

interface Category{
  id: Number,
  category: string
}

export default function Profile({shop, products} : Props) {
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
        console.log(error)
    }
  }
  
  if(!shop){
    router.push('/shop/register')
  }else{
    return (
        <div className='flex mx-10 my-10'>
            <div className='w-1/6 ml-5 -mt-10'>
                <div className='text-center justify-center mt-10'>
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src={session?.user?.image!} width="300" height="300" />
                        </div>
                    </div>
                    <div className='details font-bold text-lg'>
                        <h5>{shop.shopName}</h5>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                    <ul className="menu p-4 w-full bg-base-100 text-base-content">
                    <li><a>Profile</a></li>
                    <li><a>Products</a></li>
                    <li><a>Orders</a></li>
                    <li><a>Stats</a></li>
                    </ul>
                </div>
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
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
                        <div data-theme="garden" className="card w-auto glass" key={product.id}>
                        <figure>
                          {product.image? (
                            <img src={product.image}/>
                          ) : (
                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                          )}
                        </figure>
                        <div className="card-body py-3">
                            <h2 className="card-title">{product.name}</h2>
                            <p className='text-md'>{product.category.category}</p>    
                            <p className='text-md'>Rp. {product.price}</p>                
                            <p className='text-md'>Qty. {product.stock}</p>
                            <div className="card-actions justify-end my-2">
                            <button onClick={() => router.push({pathname: '/product/update', query: { id: product.id }})} className="w-16 btn btn-primary">Edit</button>
                            <button onClick={() => deleteProduct(product.id)} className="w-16 btn bg-red-500">Delete</button>
                            </div>
                        </div>
                        </div>
                    ) )}
                </div>
            </div>
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
            shopName: true
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
          image: true
        },
        orderBy: [
          {
            id: 'asc',
          }
        ],
    })
    return { props: {shop, products} }
}