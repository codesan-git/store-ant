import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  htmlElementId: string,
  selectProductCallback: () => any;
}

interface CartId {
    id: Number;
}
    
const SellerCancelAlert = ({htmlElementId: id, selectProductCallback} : Props) => {
  const router = useRouter();
  const {selectedTransaction, isCancelling} = selectProductCallback();
    
  let i, totalPrice = 0;
  for(i = 0; i < selectedTransaction?.order.length; i++){
    totalPrice += (selectedTransaction?.order[i].product.price * selectedTransaction?.order[i].count);
  }

  const onClose = () => {
    //console.log("close"); 
    //console.log("transaction modal ", selectedTransaction);
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  async function onCancel() {
    const cartId: CartId = {id: selectedTransaction.id};
    try{
        fetch('/api/shop/cancel', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=>  router.push({pathname: '/shop/complain/refund', query: {id: selectedTransaction.id}}))
      }catch(error){
          ////console.log(error)
      }
  }

  async function onReject() {
    const cartId: CartId = {id: selectedTransaction.id};
    try{
        fetch('/api/shop/reject', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          ////console.log(error)
      }
  }

  async function onSubmit() {
    if(Boolean(isCancelling))
        onCancel();
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
          {selectedTransaction?.order.map((order:any)=> (
            <div key={order} id="product-box" className="p-2 space-x-2 flex flex-row">
            <div id="product-detail-img-container" className=" flex justify-center items-center">
                <Image className="w-20 h-20 object-cover" 
                    width={1500}
                    height={1500}
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
          {Boolean(isCancelling) ? (
            <h1 className="text-md">Membatalkan transaksi senilai {formatter.format(totalPrice)}?</h1>
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

export default SellerCancelAlert;