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
    
const RefundAlert = ({htmlElementId: id, selectProductCallback} : Props) => {
  const router = useRouter();
  const {complain, isApproving} = selectProductCallback();
    
  const onClose = () => {
    console.log("close"); 
    console.log("transaction modal ", complain);
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  
  async function onReturn() {
    const cartId: CartId = {id: Number(complain?.productInCart.id)};
    try{
        fetch('/api/shop/return', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.push({pathname: '/shop/complain/refund', query: {id: complain?.productInCart.id}}))
      }catch(error){
          //console.log(error)
      }
  }

  async function onReject() {
    router.push({
      pathname: "/shop/complain/response/create",
      query: {id: complain.id}
    })
  }
  
  async function onSubmit() {
    if(Boolean(isApproving))
      onReturn();
    else
      onReject();
  }

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle"/>
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="flex">
            <h1 className="text-lg font-bold">Cancel</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
                <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          {selectedTransaction?.order.map((order)=> (
            <div id="product-box" className="p-2 space-x-2 flex flex-row">
            <div id="product-detail-img-container" className=" flex justify-center items-center">
                <img className="w-20 h-20 object-cover" 
                    src={order?.product.image.split(",")[0]}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                    }}
                    alt=''
                />
            </div>
            <div className="mx-5">                
                <h1 className="text-lg font-bold">{order?.product.name}</h1>
                <p>{formatter.format(order?.product.price)}</p>
                <p>Qty. {order?.count}</p>
            </div>
          </div>
          ))}
          {Boolean(isApproving) ? (
            <h1 className="text-md">Mengembalikan dana sebesar {formatter.format(complain?.productInCart.product.price * complain?.productInCart.count)}?</h1>
          ) : (
            <h1 className="text-md">Tolak Pembatalan?</h1>
          )}
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

export default RefundAlert;