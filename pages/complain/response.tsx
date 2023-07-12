import { Complain, Order } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { getTypeTransactions } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import getDataOrders from "../admin/console/testcomplain/action/getComplainSeller";
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
  console.log(`getOrders`, getOrders[11].order[0].Complain)
  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
            <th>Action</th>
            <th>Nama Buyer</th>
            <th>Nama Seller</th>
            <th>Product</th>
          </tr>
        </thead>
        {/* {getOrders.map((comp: any) => (
          <>
            {comp.order.map((orders: any) => (
              <>
                {comp.order.OrderStatus === "ONGOING" && (
                  <>
                    <tbody key={orders.complain.id}>
                      <tr className="hover">
                        <th>{orders.id}</th>
                        <td className="flex gap-4">
                          {orders.complain.image.split(",").map((kocak: string) => (
                            <>
                              <img
                                src={`http://localhost:3000\\${kocak}`}
                                className="w-16 h-16"
                              />
                            </>
                          ))}
                        </td>
                        <td>{orders.complain.description}</td>
                        <td>{orders.complain.status}</td>
                        <td>
                          <button onClick={() => acceptStatus(String(orders.complain.id))} className="btn">accept</button>
                          <button onClick={() => rejectStatus(String(orders.complain.id))} className="btn">reject</button></td>
                      </tr>
                    </tbody>
                  </>

                )}
              </>
            ))}
          </>
        ))} */}
        {getOrders.map((comp: any) => (
          <Fragment key={comp.id}>
            {comp.order.map((orders: any) => (
              <Fragment key={orders.complain}>
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
                      <td>{orders.Complain?.status}</td>
                      <td>
                        <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="btn">accept</button>
                        <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="btn">reject</button>
                      </td>
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