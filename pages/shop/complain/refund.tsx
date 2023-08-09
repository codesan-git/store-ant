import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { Product, User } from "@prisma/client";
import { useRouter } from "next/router";

interface Data {
    productInCart : ProductInCart;
}

interface ProductInCart {
    id: number;
    count: number;
    product: Product;
    cart: Cart;
}

interface Cart {
  user : User;
}

export default function Canceltest({productInCart} : Data) {
  const router = useRouter();
  //console.log(productInCart);

  return (
    <div>
        <p>Pengembalian dana sebesar Rp. {productInCart.count * productInCart.product.price} dari pembelian {productInCart.product.name} telah berhasil.</p>
        <button className="w-64 btn btn-sm btn-primary rounded-sm" onClick={()=>router.push("/")}>Kembali ke halaman utama</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    const productInCart = await prisma.productInCart.findFirst({
      where: {id: Number(id)},
      select: {
        id: true,
        count: true,
        product: true,
        cart: {
          include: {
            user: true
          }
        }
      }
    });

    return {
      props: {
        productInCart: JSON.parse(JSON.stringify(productInCart)),
      },
    };
};
  