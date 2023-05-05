import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { useState } from 'react';
import Navbar from "../navbar";
import { useRouter } from 'next/router'
import { Status } from '@prisma/client'

interface CartItems {
  cartItems: {
    id: Number;
    product: Product;
    count: Number;
    price: Number;
  }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface CartId {
  id: string[];
}

export default function Cart({ cartItems }: CartItems) {
  console.log(cartItems)
  const [data, setData] = useState([]); 
  const router = useRouter();

  if (cartItems) {
    cartItems.forEach((cartItem) => {
      cartItem.price = Number(cartItem.count) * Number(cartItem.product.price);
    });
  }

  function handleChange(id) {
    const newData = [...data];
    const index = newData.indexOf(id);
    if (index === -1) {
      newData.push(id);
    } else {
      newData.splice(index, 1);
    }
    setData(newData);

    console.log(newData);
    console.log(id);
  }

  function onCheckout(){
    const cartId:CartId = {id: data}
    try{
      fetch('http://localhost:3000/api/cart/checkout', {
          body: JSON.stringify(cartId),
          headers: {
              'Content-Type' : 'application/json'
          },
          method: 'PUT'
      }).then(()=> router.back())
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
        <Navbar />
        <div className="px-8 my-8 flex-col gap-10 cursor-pointer">
          {cartItems ? (
            <div>
              {cartItems.map((cartItem) => (
                <div
                  data-theme="garden"
                  className="card w-auto glass"
                  key={String(cartItem.id)}
                >         
                  <div className="flex">
                      <input className='w-5 ml-5' type="checkbox" value={String(cartItem.id)} onChange={e => {handleChange(e.target.value);}} />
                      <div className="card-body py-5">
                          <figure className="rounded-md h-40 w-40">
                              {cartItem.product.image? (
                                  <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                              ) : (
                                  <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                              )}
                          </figure>
                      </div>
                      <div className="card-body py-5 h-1/4 w-full">
                          <h2 className="card-title">{cartItem.product.name}</h2>
                          <p className="text-md">Rp. {String(cartItem.product.price)}</p>
                          <p className="text-md">Qty. {String(cartItem.count)}</p>
                          <p className="text-lg font-bold">
                          Total Price: Rp. {Number(cartItem.price)}
                          </p>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No Items in Cart</p>
          )}
        </div>
      <button disabled={data.length === 0? true : false} onClick={()=> onCheckout()} className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
        Checkout
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const cart = await prisma.cart.findFirst({
    where: { userId: session?.user.id },
  });
  
  if(!cart){
    return {
      props: { },
    };
  }

  const cartItems = await prisma.productInCart.findMany({
    where: { 
      AND: [
        { cartId: cart?.id },
        { status: Status.INCART }
      ] 
    },
    select: {
      id: true,
      product: true,
      count: true,
    },
  });
  return {
    props: {
      cartItems,
    },
  };
};
