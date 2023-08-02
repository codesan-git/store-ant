import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../lib/prisma";
import TransactionsDashboard from "@/components/transactions/transactions_dashboard";
import PaymentModal from "@/components/transactions/payment_modal";
import CancelAlert from "@/components/transactions/user_cancel_alert";
import DetailTransactionModal from "@/components/transactions/detail_transaction_modal";
import { Product, Order as PrismaOrder, Transaction as PrismaTransaction, TransactionStatus, Shop } from "@prisma/client";
import ReviewModal from "@/components/transactions/review_modal";
import Footer from "./footer";
import Navbar from "./navbar";
import ShopItem from "@/components/shop/shop_item";
import SellerDashboard from "@/components/shop/seller_dashboard";
import TerimaModal from "@/components/shop/terima_modal";
import axios from "axios";
import ProcessModal from "@/components/transactions/process_modal";
import ItemReceiveModal from "@/components/shop/item_receive";
import SellerCancelAlert from "@/components/transactions/seller_cancel_alert";


interface Props {
  shop: {
    shopName: string,
    balance: number ,
    image: string,
    averageRating: number 
  }
}

interface CartId {
  id: Number;
}

interface Order {
  id: number,
  transactionId: number,
  productId: number,
  count: number,
  createdAt: Date,
  updatedAt: Date,
  product: Product
}

interface Transaction {
  id: number,
  userId: number,
  shopId: number,
  status: TransactionStatus,
  createdAt: Date,
  updatedAt: Date,
  paymentMethod: string,
  order: Order[],
  shop: {
    shopName: string,
    balance: number ,
    image: string,
    averageRating: number
  },
  user: {
    name: string
  }
}

const OrdersMania = ({ transactions }: { transactions: Transaction[] }, shop: Props) => {
  const router = useRouter();

  const [currentSelectedSection, setCurrentSelectedSection] = useState<String>("Menunggu Pembayaran");

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);

  const [itemsToDisplay, setItemsToDisplay] = useState<Transaction[]>(transactions.filter((transaction) => transaction.status === TransactionStatus.UNPAID));
  const [currentRateProductName, setCurrentRateProductName] = useState<String>("");
  const [currentCartItemId, setCurrentCartItemId] = useState<Number>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
  const [transactionModalIsHidden, setTransactionModalIsHidden] = useState<Boolean>(true);

  const [sellerShop, setSellerShop] = useState<Props>({
    shop: {
      shopName: shop?.shop?.shopName,
      balance: shop?.shop?.balance,
      image: shop?.shop?.image,
      averageRating: shop?.shop?.averageRating
    }
  })

  useEffect(() => { }, [itemsToDisplay]);

  async function onSelect(transaction: Transaction) {
    setSelectedTransaction(transaction);
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
  
  async function onTolak(id:number){
    const terimaTransactions = await axios.put(`http://localhost:3000/api/shop/tolak`, {
        id: selectedTransaction?.id
    })
  }

  async function onReturn(id: Number) {
    router.push({
      pathname: "http://localhost:3000/complain/create",
      query: { id: String(id) },
    });
  }

  const onDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setTransactionModalIsHidden(false);
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

  const getTransactionDetail = () => {
    return {
      selectedTransaction
    };
  };

  const getCurrentSelectedProductForRate = () => {
    return {
      currentRateProductName,
      currentCartItemId,
    };
  };

  const TransactionDashboardArguments = () => { //Don't ever do this callback function hack again - Peter D. Luffy
    return {
      allTransactions,
      setItemsToDisplay,
      setCurrentSelectedSection,
    }
  };




  const detailTransactionModalArguments = () => {
    return {
      transactionModalIsHidden,
      setTransactionModalIsHidden: () => setTransactionModalIsHidden(true),
      getTransactionDetail
    }
  }

  const renderItemsToDisplay = () => {

    if (itemsToDisplay?.length === 0 || !itemsToDisplay) return <h1 className="h-full flex justify-center items-center">No Items</h1>

    return (
      // MASUKAN INTERFACE SHOP
      <>
        {
          itemsToDisplay?.map(
            (transaction, i) => <ShopItem
              key={i}
              transaction={transaction}
              onBayar={onSelect}
              onCancel={onSelect}
              onFinish={onFinish}
              onReturn={onReturn}
              onDetail={onDetail}
              onRate={onRateClick}
              onTerima={onSelect}
              onTolak={onTolak}
              onProcess={onSelect}
              onItemReceive={onSelect}
            />
          )
        }
      </>
    );

  }

  console.log(`transaction`, transactions)
  console.log(`name shop`, shop)
  console.log(`sellerShop`, sellerShop)

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <div id="transactions-dashboard-container" className="lg:w-1/6 lg:h-full lg:sticky lg:top-24">
          <SellerDashboard TransactionDashboardArguments={TransactionDashboardArguments} shop={{shopName:transactions[0].shop.shopName, image:transactions[0].shop.image, balance:transactions[0].shop.balance, averageRating:transactions[0].shop.averageRating}}  />
        </div>
        <div className="w-full p-2 space-y-2 bg-gray-100">
          <div className="w-full p-2 text-3xl">
            <h1>{currentSelectedSection}</h1>
          </div>
          {renderItemsToDisplay()}
        </div>
      </div>
      {/* <ReviewModal htmlElementId={`review-modal`} selectProductCallback={getCurrentSelectedProductForRate} /> */}
      <TerimaModal htmlElementId={`terima-modal`} selectProductCallback={getTransactionDetail} />
      <ProcessModal htmlElementId={`process-modal`} selectProductCallback={getTransactionDetail} />
      <ItemReceiveModal htmlElementId={`itemreceive-modal`} selectProductCallback={getTransactionDetail} />
      <SellerCancelAlert htmlElementId={`cancel-alert`} selectProductCallback={getTransactionDetail} />
      <DetailTransactionModal detailTransactionModalArguments={detailTransactionModalArguments} />
      {/* <Footer /> */}
    </div>
  );
}

export default OrdersMania;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);


  const shop = await prisma.shop.findUnique({
    where: { userId: session?.user?.id },
    include: {
      transaction: true
    }
  })
  const shopName = await prisma.transaction.findMany({
    where: {
      shopId: shop?.id
    },
    select: {
      shop: {
        select: {
          shopName: true,
          balance: true,
          image: true,
          averageRating: true
        }
      }
    }
  })
  console.log(shopName)

  const transactions = await prisma.transaction.findMany({
    where: {
      shopId: shop?.id
    },
    select: {
      id: true,
      userId: true,
      shopId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      paymentMethod: true,
      order: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              description: true,
              price: true,
            }
          }
        }
      },
      shop: {
        select: {
          shopName: true,
          balance: true,
          image: true,
          averageRating: true
        }
      },
      user: {
        select: {
          name: true
        }
      }
    }

  });

  // console.log(JSON.parse(JSON.stringify(transactions)));

  return {
    props: {
      shopName: JSON.parse(JSON.stringify(shopName)),
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  };
};
