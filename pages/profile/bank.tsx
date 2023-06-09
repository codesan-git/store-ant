import { BankType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";

interface FormData {
  bankId: string;
  name: string;
  number: string;
}

interface Bank {
  data: BankType[];
}

export default function Bank({data} : Bank) {
  const [form, setForm] = useState<FormData>({
    bankId: String(data[0].id),
    name: "",
    number: ""
  });
  const router = useRouter();
  
  const handleSave = async () => {
    try {
        await axios.post('http://localhost:3000/api/profile/bank/create', form).then(() => {router.back() });
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
              Data Rekening
            </h1>
          </div>
        </section>
      </div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="lg:flex lg:flex-row"
      >
        <section className="p-4 lg:w-1/2">            
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="product-category-input" className='font-bold'>Bank</label>
              <select name="product-category" id="product-category-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                onChange={e => {e.preventDefault(); setForm({...form, bankId: e.target.value})}} 
              >
                {data.map(bank =>(
                  <option value={bank.id} key={bank.id}>{bank.name}</option>
                ))}
              </select>
            </div>
          <div className=" space-y-4 flex flex-col pt-5">
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="product-name-input" className="font-bold">
                Nama
              </label>
              <input
                id="product-name-input"
                name="product-name"
                type="text"
                className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                value={form?.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="product-price-input" className="font-bold">
                No. Rekening
              </label>
              <input
                id="product-price-input"
                name="product-price"
                type="number"
                className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"
                value={form?.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </div>
            <button className="h-10 lg:w-36 rounded text-white bg-indigo-700">
              Submit
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const bank = await prisma.bankType.findMany();
  
    return {
      props: {
        data: JSON.parse(JSON.stringify(bank)),
      },
    };
};
  