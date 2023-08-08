import { Product, TransactionStatus} from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  htmlElementId: string,
  data: string[]
}
    
const DeleteCartAlert = ({htmlElementId: id, data} : Props) => {
  const router = useRouter();
    
  const onClose = () => {
    console.log("close"); 
    console.log("id ", data);
  }

  async function onSubmit() {
    const cartId = {id: data}
    try{
      fetch('/api/cart/delete', {
          body: JSON.stringify(cartId),
          headers: {
              'Content-Type' : 'application/json'
          },
          method: 'DELETE'
      }).then(()=> router.reload());
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
            <h1 className="text-lg font-bold">Delete</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
                <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          <h1 className="text-md">Hapus Produk dalam Keranjang?</h1>
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

export default DeleteCartAlert;