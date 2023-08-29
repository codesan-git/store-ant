import { BankType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { getSession, useSession } from "next-auth/react";
import Footer from "./footer";
import { AiFillBank } from 'react-icons/ai'
import Navbar from "./navbar";
import { BiArrowBack } from "react-icons/bi";

interface FormData {
  amount: string;
  isUserBalance: boolean;
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

export default function Withdraw({ bank }: BankData) {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>({
    amount: "",
    isUserBalance: true
  });
  const router = useRouter();

  const handleUpload = async () => {
    try {
      await axios.post('/api/profile/withdrawal/create', form).then(() => { router.back() });
    } catch (error: any) {
      ////console.log(error);
    }
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(session?.user?.balance!).toString();


  return (
    <>
      <Navbar />
      <div className="w-full h-[80vh]">
        <div className="mx-96 my-12">
          <div className="flex space-x-1 cursor-pointer px-8 my-4" onClick={() => router.back()}>
            <BiArrowBack className="my-auto" />
            <p className="font-bold">Kembali</p>
          </div>
          <div className="border border-gray-500 rounded-md">

            <div className="flex font-bold text-lg lg:text-2xl p-5 bg-[#EEEEEE] rounded-t-md">
              <AiFillBank className="my-auto mr-2 w-6 h-6 lg:w-8 lg:h-8" />
              <p>Informasi Penarikan Saldo Pengguna</p>
            </div>
            <div className="w-full">
              {/* </div> */}
              {bank ? (
                // <div>
                <div className="flex">
                  <div className="lg:grid lg:grid-cols-1 w-full rounded-lg border-gray-500 gap-4 mx-auto">
                    <div className=" p-5 lg:mb-0 my-4 mx-auto flex">
                      <div className="my-auto">
                        <h1 className="text-xl font-bold mb-2">Bank</h1>
                        <div className="mb-4 capitalize">
                          <div className="grid grid-cols-2 space-x-4">
                            <p className="font-bold text-gray-600 col-span-1">Nama Bank</p>
                            <p className="font-extrabold col-span-1">{bank.name}</p>
                          </div>
                          <div className="grid grid-cols-2 space-x-4">
                            <p className="font-bold text-gray-600 col-span-1">Nomor Rekening</p>
                            <p className="font-extrabold col-span-1">{bank.number}</p>
                          </div>
                          <div className="grid grid-cols-2 space-x-4">
                            <p className="font-bold text-gray-600 col-span-1">Nama Rekening</p>
                            <p className="font-extrabold col-span-1">{bank.bank.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-500 w-0 h-full py-4 mx-12 col-span-1"></div>
                      <div className="grid grid-cols-1 rounded-lg gap-4 mx-auto py-4 divide-y divide-gray-500 col-span-1 min-w-[201px]">
                        <div className="">
                          <h3 className="font-bold">
                            Jumlah Penarikan
                          </h3>
                          <input
                            id="product-price-input"
                            name="product-price"
                            type="number"
                            className="w-full h-10 mt-2 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                            value={form?.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          />
                          <div className="text-right">
                            <label htmlFor="" className="underline">
                              Tarik Semua
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <button
                            disabled={Number(form.amount) > Number(session?.user?.balance) ? true : false}
                            className="flex btn btn-md border-none w-full items-center rounded-lg text-white bg-[#07AEC2] my-2"
                            onClick={handleUpload}
                          >
                            {Number(form.amount) > Number(session?.user?.balance) ? "Saldo tidak mencukupi" : "Tarik Saldo"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* untuk sparator */}
                    {/* <div className="grid grid-cols-1 rounded-lg gap-4 mx-auto py-4 divide-y divide-gray-500 col-span-1">
                    <div className="">
                      <h3 className="font-bold">
                        Jumlah Penarikan
                      </h3>
                      <input
                        id="product-price-input"
                        name="product-price"
                        type="number"
                        className="w-full h-10 mt-2 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                        value={form?.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      />
                      <div className="text-right">
                        <label htmlFor="" className="underline">
                          Tarik Semua
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        disabled={Number(form.amount) > Number(session?.user?.balance) ? true : false}
                        className="flex btn btn-md border-none w-full items-center rounded-lg text-white bg-[#07AEC2] my-2"
                        onClick={handleUpload}
                      >
                        {Number(form.amount) > Number(session?.user?.balance) ? "Saldo tidak mencukupi" : "Tarik Saldo"}
                      </button>
                    </div>
                  </div> */}
                  </div>
                </div>
                // {/* </div> */}
              ) : (
                <div>
                  <p>Tambahkan informasi bank</p>
                  <button onClick={() => router.push("/profile/")}>Tambah</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* <div className="lg:px-36">
        <div id="title-hack-container" className="">
          <section className="pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center">
            <div className="lg:w-5/6 justify-start">
              <h1 className=" text-2xl mb-2 font-bold">
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
      </div> */}
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

  return {
    props: {
      bank: JSON.parse(JSON.stringify(bank)),
    },
  };
};
