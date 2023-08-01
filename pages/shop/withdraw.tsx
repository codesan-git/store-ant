import { BankType, Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { AiFillBank } from 'react-icons/ai'

interface FormData {
  amount: string;
  isUserBalance: boolean;
}

interface Data {
  bank: BankAccount;
  shop: Shop;
}

interface BankAccount {
  id: number;
  name: string;
  number: string;
  bank: BankType;
}

export default function Withdraw({ bank, shop }: Data) {
  const [form, setForm] = useState<FormData>({
    amount: "",
    isUserBalance: false
  });
  const router = useRouter();

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(shop.balance).toString();

  const handleUpload = async () => {
    try {
      await axios.post('http://localhost:3000/api/profile/withdrawal/create', form).then(() => { router.back() });
    } catch (error: any) {
      //console.log(error);
    }
  }

  return (
    <div className="w-full h-[70vh]">
      <div className="m-auto">
        <div className="mx-auto w-1/2">
          <div className="px-24 py-1">
            <div className="flex font-bold text-2xl"><AiFillBank className="my-auto mr-2 w-8 h-8" />Withdraw Form</div>
          </div>
        </div>
        <div className="flex">
          <div className="m-auto p-10 grid grid-cols-2 border rounded-lg border-gray-500 gap-4">
            <div className="border border-gray-500 rounded-lg p-5">
              <h1 className="text-xl font-bold mb-2">Information</h1>
              <div className="mb-4">
                <h3 className="font-bold text-gray-600">
                  Bank:
                </h3>
                <h3 className="text-gray-600">
                  Name: {bank.name}
                </h3>
              </div>
              <div>
                <h3 className="font-bold text-gray-600">
                  Shop:
                </h3>
                <h3 className="text-gray-600">
                  Name: {shop.shopName}
                </h3>
                <h3 className="text-gray-600">
                  Balance: {formatKas()}
                </h3>
              </div>
            </div>
            <div className="border border-gray-500 rounded-lg p-5 gap-4">
              <div className="flex gap-4">
                <h3 className="font-bold">
                  Account Number: <span className="font-normal">{bank.number}</span>
                </h3>
                <h3 className="font-bold">
                  Bank: <span className="font-normal">{bank.bank.name}</span>
                </h3>
              </div>
              <div className="my-4">
                <h3 className="font-bold text-center">
                  Withdrawal Amount
                </h3>
                <input
                  id="product-price-input"
                  name="product-price"
                  type="number"
                  className="w-full h-10 mt-2 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                  value={form?.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="flex justify-center">
                <button disabled={Number(form.amount) > Number(shop.balance) ? true : false} className="flex btn btn-md lg:w-36 items-center rounded text-white bg-indigo-700">
                  {Number(form.amount) > Number(shop.balance) ? "Saldo tidak mencukupi" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="w-full h-[90vh]">
    //   <div id="title-hack-container" className="m-auto">
    //     <section className="pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center">
    //       <div className="lg:w-5/6 justify-start">
    //         <h1 className=" text-2xl  font-bold mb-2">
    //           Withdrawal Form
    //         </h1>
    //       </div>
    //     </section>
    //   </div>
    //   <div>
    //     <form
    //       action=""
    //       onSubmit={(e) => {
    //         e.preventDefault();
    //         handleUpload();
    //       }}
    //       className=""
    //     >
    //       <section className="p-4 lg:w-1/2">
    //         <div className=" space-y-4 flex flex-col">
    //           <div className="grid grid-cols-2">
    //             <div className="flex space-y-1 w-full">
    //               <div>
    //                 <label className="font-bold">
    //                   Bank Information:
    //                 </label>
    //                 <label className="font-bold">
    //                   Name: {bank.name}
    //                 </label>
    //               </div>
    //               <div className="flex">
    //                 <label className="font-bold">
    //                   Account Number: {bank.number}
    //                 </label>
    //                 <label className="font-bold">
    //                   Bank: {bank.bank.name}
    //                 </label>
    //                 <label htmlFor="product-price-input" className="font-bold">
    //                   Withdrawal Amount
    //                 </label>
    //                 <input
    //                   id="product-price-input"
    //                   name="product-price"
    //                   type="number"
    //                   className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"
    //                   value={form?.amount}
    //                   onChange={(e) => setForm({ ...form, amount: e.target.value })}
    //                 />
    //               <button disabled={Number(form.amount) > Number(shop.balance) ? true : false} className="h-10 btn lg:w-36 rounded text-white bg-indigo-700">
    //                 {Number(form.amount) > Number(shop.balance) ? "Saldo tidak mencukupi" : "Submit"}
    //               </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </section>
    //     </form>
    //   </div>
    // </div>

  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const bank = await prisma.bankAccount.findFirst({
    where: { userId: session?.user.id },
    select: {
      id: true,
      name: true,
      number: true,
      bank: true
    }
  });

  const shop = await prisma.shop.findFirst({
    where: { userId: session?.user.id }
  })

  return {
    props: {
      bank: JSON.parse(JSON.stringify(bank)),
      shop: shop
    },
  };
};
