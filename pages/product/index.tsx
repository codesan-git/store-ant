import { GetServerSideProps } from 'next'
import React from 'react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Products {
  products:{
    id: string,
    name: string,
    price: number,
    stock: number
  }[]
}

export default function ShopProduct({products} : Products) {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function deleteProduct(id:string) {
    try{
      fetch(`http://localhost:3000/api/product/${id}`, {
        body: JSON.stringify(id),
          headers: {
              'Content-Type' : 'application/json'
          },
        method: 'DELETE'
      }).then(()=>{
        refreshData()
      })
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
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
              <figure><img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" alt="image!"/></figure>
              <div className="card-body py-3">
                <h2 className="card-title">{product.name}</h2>
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
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await prisma.product.findMany({
    select:{
      id: true,
      name: true,
      price: true,
      stock: true
    },
    orderBy: [
      {
        id: 'asc',
      }
    ],
  })
  return{
    props:{
      products
    }
  }
}
