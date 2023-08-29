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
import { BiArrowBack } from "react-icons/bi";

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
    if (Number(form.amount) > shop.balance)
      alert("Saldo tidak mencukupi");
    else if (Number(form.amount) < 10000)
      alert("Minimal penarikan 10000");
    else {
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
        <div className="mx-96 my-12">
          <div className="flex space-x-1 cursor-pointer px-8 my-4" onClick={() => router.back()}>
            <BiArrowBack className="my-auto" />
            <p className="font-bold">Kembali</p>
          </div>
          <div className="border border-gray-500 rounded-md">

            <div className="flex font-bold text-lg lg:text-2xl p-5 bg-[#EEEEEE] rounded-t-md">
              <AiFillBank className="my-auto mr-2 w-6 h-6 lg:w-8 lg:h-8" />
              <p>Informasi Penarikan Saldo Toko</p>
            </div>
            <div className="w-full">
              {bank ? (
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
                        <h1 className="text-xl font-bold mb-2">Toko</h1>
                        <div className="mb-4 capitalize">
                          <div className="grid grid-cols-2 space-x-4">
                            <p className="font-bold text-gray-600 col-span-1">Nama Toko</p>
                            <p className="font-extrabold col-span-1">{shop.shopName}</p>
                          </div>
                          <div className="grid grid-cols-2 space-x-4">
                            <p className="font-bold text-gray-600 col-span-1">Saldo</p>
                            <p className="font-extrabold col-span-1">{formatKas()}</p>
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
                            onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
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
                            disabled={Number(form.amount) > Number(shop.balance) ? true : false}
                            className="flex btn btn-md border-none w-full items-center rounded-lg text-white bg-[#07AEC2] my-2"
                            onClick={handleUpload}
                          >
                            {Number(form.amount) > Number(shop.balance) ? "Saldo tidak mencukupi" : "Tarik Saldo"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
