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
import type { TabsStylesType } from "@material-tailwind/react";

// TABS
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
// END TABS

interface CartItems {
  cartItems: {
    id: number;
    product: Product;
    count: number;
    price: number;
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

interface Transaction { //TODO: Create model in prisma
  id: Number;
  product: Product;
  count: Number;
  price: Number;
  status: Status;
}

interface CartId {
  id: Number;
}

interface Params {
  id: number;
  price: number
}

interface TransactionToken {
  token: string;
  redirectUrl: string;
}

export default function Transaction({ cartItems }: CartItems) {
  const router = useRouter();
  
  const [currentSelectedSection, setCurrentSelectedSection] = useState<String>("Menunggu Pembayaran");
  const [itemsToDisplay, setItemsToDisplay] = useState(cartItems.filter((e) => e.status === Status.UNPAID));
  const [currentRateProductName, setCurrentRateProductName] = useState<String>("");
  const [currentCartItemId, setCurrentCartItemId] = useState<Number>();
  
  useEffect(() => {}, [itemsToDisplay, currentSelectedSection]);
  
  async function onBayar(id: number, price: number) {
    const params : Params = {id: id, price: price};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/pay`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  async function onBayarDenganSaldo(id: number, price: number) {
    const params : Params = {id: id, price: price};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/paywithbalance`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  async function onCancel(id: number) {
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

  async function onFinish(id: number) {
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
      query: { id: String(id) },
    });
  }

  async function onDetail(id: string) {
    router.push({
      pathname: "/complain/detail",
      query: { id: id },
    });
  }

  async function onCommentDetail(id: number) {
    router.push({
      pathname: "http://localhost:3000/complain/response/",
      query: { id: id },
    });
  }

  const onRateClick = (productName: String, cartItemId: Number) => {
    setCurrentRateProductName(productName);
    setCurrentCartItemId(cartItemId);
  };

  const getCurrentSelectedProductForRate = () => {
    console.log(
      `returning ${currentRateProductName} and ${currentCartItemId?.toString()}`
    );
    return {
      currentRateProductName,
      currentCartItemId,
    };
  };

  const TransactionDashboardArguments = () => { //Don't ever do this callback function hack again - Peter D.
    return {
      cartItems,
      setItemsToDisplay,
      setCurrentSelectedSection,
    }
  };

  const renderItemsToDisplay = () => {

    if(itemsToDisplay.length === 0) return <h1 className="h-full flex justify-center items-center">No Items</h1>

    return (
      <>
        {
          itemsToDisplay.map(
            (transaction, i) => <ProductTransaction 
              key={i} 
              transaction={transaction} 
              onBayar={onBayar}
              onCancel={onCancel}
              onFinish={onFinish}
              onReturn={onReturn}
              onDetail={onDetail}
              onRate={onRateClick}
            />
          )
        }
      </>
    );

  }

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <div id="transactions-dashboard-container" className="lg:w-1/6 lg:h-full lg:sticky lg:top-2">
          <TransactionsDashboard TransactionDashboardArguments={TransactionDashboardArguments}/>
        </div>
        <div className="w-full p-2 space-y-2 bg-gray-100">
          <div className="w-full p-2 text-3xl">
            <h1>{currentSelectedSection}</h1>
          </div>
          {renderItemsToDisplay()}
        </div>
      </div>
      <ReviewModal htmlElementId={`review-modal`}  selectProductCallback={getCurrentSelectedProductForRate}/>
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
