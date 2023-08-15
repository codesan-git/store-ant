import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { useState } from 'react';
import Navbar from "../navbar";
import { useRouter } from 'next/router'
import { Address } from "@prisma/client";
import DeleteCartAlert from "@/components/cart_delete_modal";

interface Props {
  cartItems: {
    id: Number;
    product: Product;
    count: Number;
    price: Number;
  }[];
  mainAddress: Address;
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

export default function Cart({ cartItems, mainAddress }: Props) {
  //console.log("address: ", mainAddress);
  const [data, setData] = useState<string[]>([]); 
  const [checkoutClick, setCheckoutClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (cartItems) {
    cartItems.forEach((cartItem) => {
      cartItem.price = Number(cartItem.count) * Number(cartItem.product.price);
    });
  }

  function handleChange(id: string) {
    const newData = [...data];
    const index = newData.indexOf(id);
    if (index === -1) {
      newData.push(id);
    } else {
      newData.splice(index, 1);
    }
    setData(newData);

    //console.log(newData);
    //console.log(id);
  }

  function onCheckout(){
    setCheckoutClick(true);
    setIsLoading(true);
    const cartId:CartId = {id: data}
    try{
      fetch('/api/cart/checkout', {
          body: JSON.stringify(cartId),
          headers: {
              'Content-Type' : 'application/json'
          },
          method: 'PUT'
      }).then(()=> router.push("/transactions"))
    }catch(error){
        ////console.log(error)
    }
  }
  
  function onDelete(){
    const cartId:CartId = {id: data}
    try{
      fetch('/api/cart/delete', {
          body: JSON.stringify(cartId),
          headers: {
              'Content-Type' : 'application/json'
          },
          method: 'DELETE'
      }).then(()=> router.reload());
    }catch(error){
        ////console.log(error)
    }
  }

  return (
    <div>
        <Navbar />
        <div className="px-8 my-8 flex-col gap-10 cursor-pointer">
          { isLoading? (
            <div className="text-red-500">LOADING...</div>
          ) : (
            <></>
          )}
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
                                  <img src={cartItem.product.image}/>
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
      {mainAddress == null? (
        <p>Alamat utama belum diatur</p>
      ) : (
        <></>
      )}
      {(data.length === 0 || mainAddress == null) ? (        
        <button disabled={true} onClick={()=> onCheckout()} className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
          Checkout
        </button>
      ) : (        
        <button disabled={checkoutClick} onClick={()=> onCheckout()} className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
          Checkout
        </button>
      )}
      <button disabled={data.length === 0} className='ml-5 w-36 btn bg-red-400 hover:bg-red-300 hover:border-gray-500 text-white border-transparent'>
          <label htmlFor="cart-alert">
            Delete
          </label>
      </button>
      <DeleteCartAlert htmlElementId={`cart-alert`} data={data}/>
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
        { cartId: cart?.id }
      ] 
    },
    select: {
      id: true,
      product: true,
      count: true,
    },
  });

  const mainAddress = await prisma.address.findFirst({
    where:{
      profile: {
        userId: session?.user.id
      },
      isMainAddress: true
    }
  })
  return {
    props: {
      cartItems,
      mainAddress
    },
  };
};
