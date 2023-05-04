import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import ProductCard from '@/components/product_card'
import Navbar from '../navbar'
import Footer from '../footer'
import { Status } from '@prisma/client'

interface CartItems {
    cartItems: {
      id: Number;
      product: Product;
      count: Number;
      price: Number;
      status: Status;
    }[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
}

export default function Transaction({ cartItems }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const{data:session} = useSession();
  let belumBayar = new Array();
  let dikemas = new Array();
  let dikirim = new Array();
  let selesai = new Array();

  if(cartItems){
    let i: Number;
    for(i = 0; i < cartItems.length; i++){
        if(cartItems[i].status === Status.PACKING)
            dikemas.push(cartItems[i]);
    }
    console.log(dikemas);
    
    for(i = 0; i < cartItems.length; i++){
        if(cartItems[i].status === Status.DELIVERING)
            dikirim.push(cartItems[i]);
    }
    console.log(dikirim);
    
    for(i = 0; i < cartItems.length; i++){
        if(cartItems[i].status === Status.FINISHED)
            selesai.push(cartItems[i]);
    }
    console.log(selesai);
  }

  return (
    <>
      <Navbar />
      <div className='flex mx-10 my-10'>
          <div className='w-1/6 ml-5 -mt-10'>
              <div className='text-center justify-center mt-10'>
                  <div className="avatar">
                      <div className="w-24 rounded-full">
                          <img src={session?.user?.image!} width="300" height="300" />
                      </div>
                  </div>
                  <div className='details font-bold text-lg'>
                      <h5>{session?.user?.email}</h5>
                  </div>
              </div>
              <div className="drawer-side">
                  <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                  <ul className="menu p-4 w-full bg-base-100 text-base-content">
                  <li><a>Profile</a></li>
                  <li><a>Orders</a></li>
                  <li><a>Notifications</a></li>
                  <li><a>Vouchers</a></li>
                  </ul>
              </div>
          </div>
          <div className="w-full">
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dikemas</p>
                    </div>
                </section> 
                {dikemas.length !==0 ? (
                    <div>
                        {dikemas.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dikirim</p>
                    </div>
                </section> 
                {dikirim.length !==0 ? (
                    <div>
                        {dikirim.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Selesai</p>
                    </div>
                </section> 
                {selesai.length !==0 ? (
                    <div>
                        {selesai.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
          </div>
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const shop = await prisma.shop.findFirst({
    where:{userId: session?.user?.id!}
  })

  const cartItems = await prisma.productInCart.findMany({
    where:{
        product: {shopId: shop?.id!},
        status: {not: Status.UNPAID},
        status: {not: Status.INCART}
    },
    select:{
        id: true,
        product: true,
        count: true,
        status: true
    }
  })
  return {
    props: {
      cartItems,
    },
  };
}