import { GetServerSideProps } from "next";

import { getTypeTransactions } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import getDataOrders from "./action/getComplainSeller";
import { Fragment } from "react";

interface Props {
  getOrders: getTypeTransactions[]
}

export default function ComplainAdmin({ getOrders }: Props) {

  const router = useRouter()
  const acceptStatus = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/complain/seller/accept`, {
        id: id
      }).then(() => router.refresh())

    } catch (error) {

    }
  };

  const rejectStatus = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/complain/seller/reject`, {
        id: id
      }).then(() => router.refresh())

    } catch (error) {

    }
  };
  // console.log(`getOrders`,getOrders)
  console.log(`getOrders`, getOrders[11].order[0].OrderStatus)
  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Image</th>
            <th>Description</th>
            <th>Status Complain</th>
            <th>Status Order</th>
            <th>Action Complain</th>
            <th>Nama Buyer</th>
            <th>Nama Toko</th>
            <th>Product</th>
          </tr>
        </thead>
        {getOrders.map((comp: any) => (
          <Fragment key={comp.id}>
            {comp.order.map((orders: any) => (
              <Fragment key={orders.id}>
                {orders.Complain?.status === "OPEN" && (
                  <tbody>
                    <tr className="hover">
                      <th>{orders.Complain?.orderId}</th>
                      <td className="flex gap-4">
                        {orders.Complain?.image.split(",").map((kocak: string) => (
                          <img
                            key={kocak}
                            src={`http://localhost:3000/${kocak}`}
                            className="w-16 h-16"
                          />
                        ))}
                      </td>
                      <td>{orders.Complain?.description}</td>
                      <td className="text-center">{orders.Complain?.status}</td>
                      <td className="text-center">{orders.OrderStatus}</td>
                      <td className="gap-4">
                        {orders.OrderStatus === "RETURNED" || orders.OrderStatus === "NEED_ADMIN_REVIEW" ?
                          <>
                            <div className="flex gap-2">
                              <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="btn-disabled w-16 h-8 rounded-sm">accept</button>
                              <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="btn-disabled w-16 h-8 rounded-sm">reject</button>
                            </div>
                          </>
                          :
                          <>
                            <div className="flex gap-2">
                              <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                              <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                            </div>
                          </>
                        }
                        {/* <div className="flex gap-2">
                          <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                          <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                        </div> */}
                      </td>
                      <td>{comp.user.name}</td>
                      <td>{comp.shop.shopName}</td>
                      <td></td>
                    </tr>
                  </tbody>
                )}
              </Fragment>
            ))}
          </Fragment>
        ))}

      </table>
    </div >
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const complain = await getDataOrders(context)

  return {
    props: {
      getOrders: JSON.parse(JSON.stringify(complain))
    },
  };
}