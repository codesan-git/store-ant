import React, { useEffect, useState } from "react";
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

  
  const [itemsToDisplay, setItemsToDisplay] = useState(cartItems);
  
  useEffect(() => {}, [itemsToDisplay]);

  const TransactionDashboardArguments = () => { //Don't ever do this callback function hack again
    return {
      cartItems,
      setItemsToDisplay
    }
  };

  const renderItemsToDisplay = () => {

    if(itemsToDisplay.length === 0) return <h1 className="h-full flex justify-center items-center">No Items</h1>

    return (
      <>
        {itemsToDisplay.map((transaction, i) => <ProductTransaction key={i} ProductStatus={transaction.status}/>)}
      </>
    );

  }

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <TransactionsDashboard TransactionDashboardArguments={TransactionDashboardArguments}/>
        <div className="w-full space-y-2 bg-gray-100">
          {renderItemsToDisplay()}
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
