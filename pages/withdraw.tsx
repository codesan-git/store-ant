import { BankType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession, useSession } from "next-auth/react";

interface FormData {
  amount: string;
}

interface BankData {
  bank: BankAccount;
}

interface BankAccount {
  id: number;
  name: string;
  number: string;
  bank: BankType;
}

export default function Withdraw({bank} : BankData) {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>({
    amount: "",
  });
  const router = useRouter();
  
  const handleUpload = async () => {
    try {
        await axios.post('http://localhost:3000/api/profile/withdrawal/create', form).then(() => {router.back() });
    } catch (error: any) {
        //console.log(error);
    }
  }

  return (
    <div className="lg:px-36">
      <div id="title-hack-container" className="">
        <section className="pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center">
          <div className="lg:w-5/6 justify-start">
            <h1 className=" text-2xl  font-bold mb-2 font-bold">
              Withdrawal Form
            </h1>
          </div>
        </section>
      </div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="lg:flex lg:flex-row"
      >
        <section className="p-4 lg:w-1/2">
          <div className=" space-y-4 flex flex-col">
            <div className="flex flex-col space-y-1 w-full">
              <label className="font-bold">
                Bank Information: 
              </label>
              <label className="font-bold">
                Name: {bank.name} 
              </label>
              <label className="font-bold">
                Account Number: {bank.number} 
              </label>
              <label className="font-bold">
                Bank: {bank.bank.name} 
              </label>
              <label htmlFor="product-price-input" className="font-bold">
                Withdrawal Amount
              </label>
              <input
                id="product-price-input"
                name="product-price"
                type="number"
                className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                value={form?.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <button disabled={Number(form.amount) > Number(session?.user.balance) ? true : false} className="h-10 btn lg:w-36 rounded text-white bg-indigo-700">
              {Number(form.amount) > Number(session?.user.balance) ? "Saldo tidak mencukupi" : "Submit"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const bank = await prisma.bankAccount.findFirst({
    where: {userId: session?.user.id},
    select:{
      id: true,
      name: true,
      number: true,
      bank: true
    }
  });

  return {
    props: {
      bank: JSON.parse(JSON.stringify(bank)),
    },
  };
};
