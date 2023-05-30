import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

interface CartId {
    id: number
}
  
export default function Redirect() {
  const router = useRouter();
  const { order_id, status_code, transaction_status } = router.query;

  if (status_code == "200") {
    UpdateStatus();
  }

  async function UpdateStatus() {
    const cartId:CartId = {id: Number((String(order_id).split("-")[2]))}
    console.log(cartId);
    await axios.post(`http://localhost:3000/api/cart/success`, cartId);
  }

  return (
    <div>
      <p>{order_id}</p>
      <p>{status_code}</p>
      <p>{transaction_status}</p>
      <p>{status_code == "200" ? "Pembayaran Berhasil" : "Pembayaran Gagal"}</p>
      <button className="w-64 btn btn-sm btn-primary rounded-sm" onClick={()=>router.push("/")}>Kembali ke halaman utama</button>
    </div>
  );
}
