import styles from '../../styles/Form.module.css'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import { getSession} from 'next-auth/react';
import Navbar from '../navbar'
import Head from 'next/head';
import Image from 'next/image';
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
        <div className="my-5 mx-2 px-48">
            <div id='content' className="flex flex-row space-x-2">
                <section id='product-details-and-description' className='w-2/3 space-y-2'>
                    <div id='product-image-container' className="p-4 w-full h-auto flex">
                      <img
                        src={"https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"}
                        alt=''
                        className='mx-auto my-auto h-auto'
                      />
                    </div>
                    <div id='product-title-container' className='p-4 flex flex-row items-center border-b-gray-300 border-b-2'>
                      <h1 className='text-5xl w-1/2'>{product.name}</h1>
                      <div id='actions' className='flex flex-row w-1/2 justify-end space-x-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clip-rule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                    </div>
                    <div id='category-and-description' className='p-4 border-b-gray-300 border-b-2'>
                      <div className='flex flex-row space-x-2 mb-2'>
                        <h1>{product.category.category}</h1>
                        <h1 className='text-gray-700'>•</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-yellow-500">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <h1>4.3</h1>
                      </div>
                        <h1 className='text-2xl mb-2'>Description</h1>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                    </div>
                    <div id='store-details' className='p-4 border-b-gray-300 border-b-2'>
                      <ShopDetailCard/>
                    </div>
                    <div id='reviews' className='p-4 border-b-gray-300 border-b-2'>
                      <h1 className='text-2xl mb-2'>Reviews</h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate suscipit laborum velit. 
                        Ipsam iste error vero obcaecati aliquid consequuntur asperiores distinctio ipsa alias, nihil, nam commodi, placeat nisi eius laborum.</p>
                    </div>
                </section>
                <section className='w-1/3 h-1/3 p-4 shadow-lg rounded-lg'>
                  <div >
                      <h1>Stok {renderStockCount(product.stock)}</h1>
                      <h1 className='text-4xl my-2'>Rp.{product.price.toString()}</h1>
                      <div className="custom-number-input h-10 w-32">
                          <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                              <button
                                  onClick={()=> setCount(count - 1)}
                                  disabled={count == 0? true : false}
                                  className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                              >
                                <span className="m-auto text-2xl font-thin">−</span>
                              </button>
                              <input
                              type="text"
                              inputMode="numeric"
                              className="mx-auto outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md pointer-events-none md:text-basecursor-default flex items-center text-gray-700 "
                              name="custom-input-number"
                              value={String(count)}
                              ></input>
                              <button
                              onClick={()=> setCount(count + 1)}              
                              disabled={count == product.stock? true : false}
                              className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                              >
                              <span className="m-auto text-2xl font-thin">+</span>
                              </button>
                          </div>
                        </div>
                        <h1>Subtotal: Rp.{Subtotal}</h1>
                        <div id='button-group' className='mt-4 w-auto space-x-4'>
                            <button disabled={count === 0? true : false} className='w-24 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                                Beli
                            </button>
                            <button onClick={()=> create()} disabled={count === 0? true : false} className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                                Add to Cart
                            </button>
                        </div>
                  </div>
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

/*
import styles from "../../styles/Form.module.css";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import Navbar from "../navbar";
import { useState } from "react";
import axios from "axios";

interface FetchData {
  product: {
    id: Number;
    name: string;
    price: Number;
    stock: Number;
    category: Category;
    image: string;
  };
}

interface Category {
  id: Number;
  category: string;
}

interface CartData{
    productId: Number;
    count: Number
}

export default function CreateShop({ product }: FetchData) {
  const [count, setCount] = useState(0);
  const router = useRouter();
  //   const {id} = router.query;

  async function create() {
    const data : CartData = {productId: product.id, count: count};
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

  return (
    <div>
      <Navbar />
      <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
          <div className="title">
            <h1 className="text-gray-800 text-4xl font-bold py-4">
              Product Detail
            </h1>
          </div>

          <div>
            <figure>
              {product.image ? (
                <img src={`http://localhost:3000/${product.image}`} />
              ) : (
                <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
              )}
            </figure>
            <p>{product.name}</p>
            <p>{product.category.category}</p>
            <p>{String(product.price)}</p>
            <p>{String(product.stock)}</p>
          </div>
          <div className="custom-number-input h-10 w-32 -mt-10">
            <label className="custom-input-number w-full text-gray-700 text-sm font-semibold">
              Counter Input
            </label>
            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
              <button
                onClick={()=>setCount(count - 1)}
                disabled={count == 0? true : false}
                className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
              >
                <span className="m-auto text-2xl font-thin">−</span>
              </button>
              <input
                type="text"
                inputMode="numeric"
                className="mx-auto outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md pointer-events-none md:text-basecursor-default flex items-center text-gray-700 "
                name="custom-input-number"
                value={String(count)}
              ></input>
              <button
                onClick={()=>setCount(count + 1)}              
                disabled={count == product.stock? true : false}
                className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
              >
                <span className="m-auto text-2xl font-thin">+</span>
              </button>
            </div>
            <button onClick={()=> create()} disabled={count === 0? true : false} className="w-32 btn btn-primary mt-5">Add to Cart</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const product = await prisma.product.findFirst({
    where: { id: Number(context.query.id) },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: true,
      image: true,
    },
  });
  return {
    props: {
      product,
    },
  };
};
*/