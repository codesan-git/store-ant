import React, { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import Navbar from "./navbar";
import Footer from "./footer";
import { Status } from "@prisma/client";
import ReviewModal from "../components/transactions/review_modal";
import TransactionsDashboard from "@/components/transactions/transactions_dashboard";
import ProductTransaction from "@/components/transactions/product_transaction";
import { TRANSACTION_STATUS } from "@/components/transactions/product_transaction";

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

interface CartId {
  id: Number;
}

export default function Transaction({ cartItems }: CartItems) {
  const router = useRouter();
  const { data: session } = useSession();
  let belumBayar = new Array();
  let dikemas = new Array();
  let dikirim = new Array();
  let selesai = new Array();
  let dibatalkan = new Array();
  let dikembalikan = new Array();

  const [openTab, setOpenTab] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [currentRateProductName, setCurrentRateProductName] = useState<String>("");
  const [currentCartItemId, setCurrentCartItemId] = useState<Number>();

  if (cartItems) {
    let i: number;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.UNPAID) belumBayar.push(cartItems[i]);
    }
    console.log(belumBayar);

    for (i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].status === Status.PACKING ||
        cartItems[i].status === Status.CANCELING ||
        cartItems[i].status === Status.CANCEL_REJECTED
      )
        dikemas.push(cartItems[i]);
    }
    console.log(dikemas);

    for (i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].status === Status.DELIVERING ||
        cartItems[i].status === Status.RETURNING || 
        cartItems[i].status === Status.NEED_ADMIN_REVIEW
      )
        dikirim.push(cartItems[i]);
    }
    console.log(dikirim);

    for (i = 0; i < cartItems.length; i++) {
      if (
          cartItems[i].status === Status.FINISHED || 
          cartItems[i].status === Status.RETURN_REJECTED
      ) 
        selesai.push(cartItems[i]);
    }
    console.log(selesai);

    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.CANCELED)
        dibatalkan.push(cartItems[i]);
    }
    console.log(dibatalkan);

    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.RETURNED)
        dikembalikan.push(cartItems[i]);
    }
    console.log(dikembalikan);
  }

  async function onBayar(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/pay", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onCancel(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/cancel", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onFinish(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/finish", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onReturn(id: Number) {
    router.push({
      pathname: "http://localhost:3000/complain/create",
      query: {id: String(id)}
    })
    // const cartId: CartId = { id: id };
    // try {
    //   fetch("http://localhost:3000/api/cart/return", {
    //     body: JSON.stringify(cartId),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "PUT",
    //   }).then(() => router.reload());
    // } catch (error) {
    //   //console.log(error)
    // }
  }

  async function onDetail(id: string) {
    router.push({
      pathname: "/complain/detail",
      query: { id: id },
    });
  }

  const onRateClick = (productName: String, cartItemId: Number) => {
    setCurrentRateProductName(productName); 
    setCurrentCartItemId(cartItemId);
  }

  const getCurrentSelectedProductForRate = () => {
    console.log(`returning ${currentRateProductName} and ${currentCartItemId?.toString()}`);
    return {
      currentRateProductName,
      currentCartItemId
    };
  };

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <TransactionsDashboard />
        <div className="w-full space-y-2 bg-gray-100">
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.AWAITING_PAYMENT}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.AWAITING_CONFIRMATION}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.SUCCESS}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.FAILED}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.BEING_PROCESSED}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.AWAITING_COURIER}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.DELIVERING}/>
          <ProductTransaction ProductStatus={TRANSACTION_STATUS.REACHED_DESTINATION}/>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const cart = await prisma.cart.findFirst({
    where: { userId: session?.user.id },
  });

  if (!cart) {
    return {
      props: {},
    };
  }

  const cartItems = await prisma.productInCart.findMany({
    where: {
      AND: [{ cartId: cart?.id }, { status: { not: Status.INCART } }],
    },
    select: {
      id: true,
      product: true,
      count: true,
      status: true,
    },
  });
  return {
    props: {
      cartItems,
    },
  };
};
