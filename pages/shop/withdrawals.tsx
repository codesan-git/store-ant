import { BankType, Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { AiFillBank } from 'react-icons/ai'
import Footer from "../footer";
import Navbar from "../navbar";

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
  const exceptThisSymbols = ["e", "E", "+", "-", ".", ","];

  const formatKas = () => formatter.format(shop.balance).toString();

  const handleUpload = async () => {
    if(Number(form.amount) > shop.balance)
      alert("Saldo tidak mencukupi");
    else if(Number(form.amount) < 10000)
      alert("Minimal penarikan 10000");
    else{
      try {
        await axios.post('/api/profile/withdrawal/create', form).then(() => { router.back() });
      } catch (error: any) {
        ////console.log(error);
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-[80vh]">
        <div className="my-14 lg:my-20">
          <div className="mx-auto w-full lg:w-1/2">
            <div className="lg:px-24 py-1">
              <div className="flex font-bold text-lg lg:text-2xl"><AiFillBank className="my-auto mr-2 w-6 h-6 lg:w-8 lg:h-8" />Withdraw Form</div>
            </div>
          </div>
          {bank ? (
            <div>
              <div className="flex">
                <div className="m-auto p-10 lg:grid lg:grid-cols-2 border rounded-lg border-gray-500 gap-4">
                  <div className="border border-gray-500 rounded-lg p-5 mb-5 lg:mb-0">
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
                        onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        disabled={Number(form.amount) > Number(shop.balance) ? true : false}
                        className="flex btn btn-md lg:w-36 items-center rounded text-white bg-indigo-700"
                        onClick={handleUpload}
                      >
                        {Number(form.amount) > Number(shop.balance) ? "Saldo tidak mencukupi" : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>          
              <p>Tambahkan informasi bank</p>
              <button onClick={()=>router.push("/profile/")}>Tambah</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
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
