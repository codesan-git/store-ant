import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Navbar from "../navbar";

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

export default function Cart({ cartItems }: CartItems) {
  if (cartItems) {
    cartItems.forEach((cartItem) => {
      cartItem.price = Number(cartItem.count) * Number(cartItem.product.price);
    });
  }

  return (
    <div>
      <Navbar />
      <div className="px-8 my-8 flex-col gap-10 cursor-pointer">
        {cartItems.map((cartItem) => (
          <div
            data-theme="garden"
            className="card w-auto glass"
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const cart = await prisma.cart.findFirst({
    where: { userId: session?.user.id },
  });

  const cartItems = await prisma.productInCart.findMany({
    where: { cartId: cart?.id },
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
