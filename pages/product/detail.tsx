import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import { getSession} from 'next-auth/react';
import Navbar from '../navbar'
import Head from 'next/head';
import {useEffect, useState} from 'react';
import ShopDetailCard from '@/components/shop_detail_card';

interface FetchData{
    product:{
        id: Number,
        name: string,
        price: Number,
        stock: Number,
        category: Category,
        image: string
    }
}

interface Category{
  id: Number,
  category: string
}

interface CartData{
  productId: Number;
  count: Number
}

export default function CreateShop({product} : FetchData) { 
  const [count, setCount] = useState(0);   
  const [Subtotal, setSubtotal] = useState(0);
  const router = useRouter();
  const {id} = router.query;

  const handleCount = () => {

    let newSubtotal = product.price.valueOf() * count;
    console.log('New subtotal: ' + newSubtotal.toString())
    setSubtotal(newSubtotal);
  }

  async function create() {
    const data : CartData = {productId: product.id, count: (Number(product.stock) - Number(count))};
    try{
        fetch('http://localhost:3000/api/cart/add', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> router.back())
    }catch(error){
        console.log(error)
    }
  }

  useEffect(() => {
    handleCount();
  }, [count]);

  return (
    <div>
        <Head>
            <title>
                {product.name} | Store.ant
            </title>
        </Head>
        <Navbar/>
        <div className="">
          <section id='product-information-panel'>

          </section>
          <section id='item-order-section'>
          </section>
          <div id='mobile-item-order-section' className='visible sm:invisible fixed bottom-0 left-0 bg-blue-gray-300 flex flex-row p-2 h-18 w-screen align-middle justify-center'>
            <section id='price-section' className='w-1/2 flex flex-row justify-center'>
              {/* <div id='text-container' className='h-10 w-auto p-1 flex items-center justify-center text-white'>
                <h1>Price: Rp.{product.price.toString()}</h1>
              </div> */}
              <button className='h-10 w-40 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Placeholder Button
              </button>
            </section>
            <section id='button-actions-section' className='w-1/2 space-x-2 flex flex-row justify-center'>
              <button className='h-10 w-20 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Beli
              </button>
              <button className='h-10 w-24 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Add to cart
              </button>
            </section>
          </div>
        </div>
    </div>
  )
}

const renderStockCount = (stockNumber: Number) => {
    if(stockNumber.valueOf() > 0) {
        return <span className='text-cyan-600'>{stockNumber.toString()}</span>
    } else {
        return <span className='text-red-500'>{stockNumber.toString()}</span>
    }
}



export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const product = await prisma.product.findFirst({
        where: { id: Number(context.query.id)},
        select:{
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            image: true
        }
    })
    return{
        props:{
            product
        }
    }
}