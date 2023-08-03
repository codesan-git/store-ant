import { Product, Status } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  htmlElementId: string,
  selectProductCallback: () => any;
}

interface CartId {
  id: Number;
}
    
const WithdrawalDetail = ({htmlElementId: id, selectProductCallback} : Props) => {
  const router = useRouter();
  const {selectedWithdrawal: withdrawal} = selectProductCallback();
    
  const onClose = () => {
    console.log("close"); 
    console.log("withdrawal modal ", withdrawal);
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  
  async function onSubmit() {
    const cartId: CartId = {id: Number(withdrawal?.id)};
    try{
        fetch('/api/admin/withdrawal/confirm', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle"/>
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="flex">
            <h1 className="text-lg font-bold">Withdrawal</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
                <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          <div id="product-box" className="p-2 space-x-2 flex flex-row">
            <div className="mx-5">                
                <h1 className="text-lg font-bold">Requested by: {withdrawal?.user.name}</h1>
                <p>Amount: {formatter.format(withdrawal?.amount)}</p>
                <p>Bank Detail:</p>
                <p>Bank: {withdrawal?.user.bankAccount.bank.name}</p>
                <p>Account Number: {withdrawal?.user.bankAccount.number}</p>
                <p>Account Name: {withdrawal?.user.bankAccount.name}</p>
            </div>
          </div>
          <h1 className="text-md">Mengembalikan dana sebesar {formatter.format(withdrawal?.amount)}?</h1>
          <div className="flex gap-x-5">
            <label onClick={onSubmit} htmlFor={id} className="h-10 w-full rounded text-white bg-indigo-700 hover:bg-indigo-900 hover:cursor-pointer flex justify-center items-center">
              Ya
            </label>
            <label onClick={onClose} htmlFor={id} className="h-10 w-full rounded text-white bg-indigo-700 hover:bg-indigo-900 hover:cursor-pointer flex justify-center items-center">
              Tidak
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawalDetail;