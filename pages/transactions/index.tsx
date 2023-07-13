import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";
import Navbar from "../navbar";
import Footer from "../footer";
import ReviewModal from "../../components/transactions/review_modal";
import TransactionsDashboard from "@/components/transactions/transactions_dashboard";
import TransactionItem from "@/components/transactions/transaction_item";
import PaymentModal from "@/components/transactions/payment_modal";
import CancelAlert from "@/components/transactions/user_cancel_alert";
import DetailTransactionModal from "@/components/transactions/detail_transaction_modal";
import { Product, Order as PrismaOrder, Transaction as PrismaTransaction, TransactionStatus } from "@prisma/client";
import Chat from "@/components/transactions/chat";
import ComplainModal from "@/components/transactions/complain_modal";
import RatingModal from "@/components/transactions/rating_modal";


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
  id: string,
  userId: string,
  shopId: number,
  status: TransactionStatus,
  createdAt: Date,
  updatedAt: Date,
  paymentMethod: string,
  order: Order[],
  shop: {
    shopName: string
  }
}

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  const router = useRouter();

  const [currentSelectedSection, setCurrentSelectedSection] = useState<String>("Menunggu Pembayaran");

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);

  const [itemsToDisplay, setItemsToDisplay] = useState<Transaction[]>(transactions.filter((transaction) => transaction.status === TransactionStatus.UNPAID));
  const [currentRateProductName, setCurrentRateProductName] = useState<String>("");
  const [currentCartItemId, setCurrentCartItemId] = useState<Number>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const [transactionModalIsHidden, setTransactionModalIsHidden] = useState<Boolean>(true);
  const [complainModalIsHidden, setComplainModalIsHidden] = useState<Boolean>(true);
  const [ratingModalIsHidden, setRatingModalIsHidden] = useState<Boolean>(true);

  const [chatIsHidden, setChatIsHidden] = useState<boolean>(true);

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

  const onComplain = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setComplainModalIsHidden(false);
  }

  const onRating = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setRatingModalIsHidden(false);
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

  const getTransactionComplain = () => {
    return {
      selectedTransaction
    };
  };

  const getTransactionRating = () => {
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
      chatIsHidden,
      setChatIsHidden,
    }
  };

  const detailTransactionModalArguments = () => {
    return {
      transactionModalIsHidden,
      setTransactionModalIsHidden: () => setTransactionModalIsHidden(true),
      getTransactionDetail
    }
  }

  const complainTransactionModalArguments = () => {
    return {
      complainModalIsHidden,
      setComplainModalIsHidden: () => setComplainModalIsHidden(true),
      getTransactionComplain
    }
  }

  const ratingTransactionModalArguments = () => {
    return {
      ratingModalIsHidden,
      setRatingModalIsHidden: () => setRatingModalIsHidden(true),
      getTransactionRating
    }
  }

  const renderItemsToDisplay = () => {

    // if(itemsToDisplay?.length === 0 || !itemsToDisplay) return <h1 hidden={chatIsHidden} className="h-full flex justify-center items-center">No Items</h1>;

    return (
      <div hidden={!chatIsHidden} className="w-full space-y-2">
        {
          (itemsToDisplay?.length === 0 || !itemsToDisplay) ?
            <h1 hidden={chatIsHidden} className="flex justify-center items-center">No Items</h1>
            : itemsToDisplay?.map(
              (transaction, i) => <TransactionItem
                key={i}
                transaction={transaction}
                onBayar={onSelect}
                onCancel={onSelect}
                onFinish={onFinish}
                onReturn={onReturn}
                onDetail={onDetail}
                onRate={onRateClick}
                onComplain={onComplain}
                onRating={onRating}
              />
            )
        }
      </div>
    );
  }

  const complainModalArguments = () => {
    return (
      <>
        <input type="checkbox" id="complain-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">This modal works with a hidden checkbox!</p>
            <div className="modal-action">
              <label htmlFor="complain-modal" className="btn">Close!</label>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <div id="transactions-dashboard-container" className="lg:w-1/6 lg:h-full lg:sticky lg:top-24">
          <TransactionsDashboard TransactionDashboardArguments={TransactionDashboardArguments} />
        </div>
        <div className="w-full p-2 space-y-2 bg-gray-100">
          <div className="w-full p-2 text-3xl">
            <h1>{currentSelectedSection}</h1>
          </div>
          {renderItemsToDisplay()}
          <Chat hidden={chatIsHidden} onClose={() => setChatIsHidden(true)} />
        </div>
      </div>
      <ReviewModal htmlElementId={`review-modal`} selectProductCallback={getCurrentSelectedProductForRate} />
      <PaymentModal htmlElementId={`payment-modal`} selectProductCallback={getTransactionDetail} />
      <CancelAlert htmlElementId={`cancel-alert`} selectProductCallback={getTransactionDetail} />
      <DetailTransactionModal detailTransactionModalArguments={detailTransactionModalArguments} />
      <ComplainModal complainTransactionModalArguments={complainTransactionModalArguments} />
      <RatingModal ratingTransactionModalArguments={ratingTransactionModalArguments} />
    </div>
  );
}

export default Transactions;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session?.user.id
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
              weight: true
            }
          }
        }
      },
      shop: {
        select: {
          shopName: true
        }
      }
    }

  });

  const trans = await prisma.transaction.findMany({
    where: {
      userId: session?.user.id
    }
  })

  console.log(JSON.parse(JSON.stringify(transactions)));

  return {
    props: {
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  };
};
