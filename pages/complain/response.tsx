import { GetServerSideProps } from "next";

import { getTypeTransactions } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import getDataOrders from "./action/getComplainSeller";
import { Fragment } from "react";
import { HiShoppingCart } from "react-icons/hi";

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
    <>
      <div className="hidden lg:block">
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
                  {orders.Complain?.status && (
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
                          {orders.OrderStatus === "RETURNED" || orders.OrderStatus === "NEED_ADMIN_REVIEW" || orders.OrderStatus === "RETURN_REJECTED" ?
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
      </div>
      <div className="lg:hidden">
        {getOrders.map((comp: any) => (
          <Fragment key={comp.id}>
            {comp.order.map((orders: any) => (
              <Fragment key={orders.id}>
                {orders.Complain?.status && (
                  <div className="my-4">
                    <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
                      <div className="w-1/2 flex justify-start items-center ">
                        <h1 className="text-sm lg:text-xl font-bold">{orders.Complain?.id}</h1>
                      </div>
                      <div className="w-full flex flex-row items-center space-x-2 justify-end">
                        <h1 className="flex justify-end text-sm font-bold text-red-600">{orders.OrderStatus}</h1>
                        <h1 className="flex justify-end text-xs">{orders.createdAt.split("",10)}</h1>
                      </div>
                    </div><div id="lower-detail">
                      <div id="product-details" className="flex flex-row p-2 bg-gray-300">
                        <div id="product-detail-img-container" className=" flex justify-center items-center">
                          {orders.Complain?.image.split(",").map((kocak: string) => (
                            <img
                              key={kocak}
                              src={`http://localhost:3000/${kocak}`}
                              className="w-16 h-16"
                            />
                          ))}
                        </div>
                        <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
                          <h1 className="text-xs lg:text-base">Kode Transaksi: {orders.Complain?.orderId} </h1>
                          <h1 className="text-xs lg:text-base font-bold">{orders.Complain?.description}</h1>
                          <h1 className="text-xs lg:text-base">Jumlah: {orders.count}</h1>
                          {/* {renderExtraItems()} */}
                        </div>
                      </div>
                      <div id="total-section" className="flex flex-row p-2 bg-gray-400">
                        <div id="total-details" className="w-full lg:hidden">
                          <h1 className="text-xs items-center">Complain Status: {orders.Complain?.status}</h1>
                          {/* <h1 className="text-xs">Rp {calculateTransactionTotal().toString()}</h1> */}
                        </div>
                        <div className="w-1/3 hidden lg:flex lg:flex-row lg:justify-start lg:items-center">
                          <HiShoppingCart className="mr-1" />
                          {/* {renderTransactionDate()} */}
                        </div>
                        <div id="transaction-actions" className="w-2/3 lg:w-full flex flex-row justify-end space-x-2">
                          {/* {renderActionButtons()} */}
                          {orders.OrderStatus === "RETURNED" || orders.OrderStatus === "NEED_ADMIN_REVIEW" || orders.OrderStatus === "RETURN_REJECTED" ?
                            <>
                              <div className="flex gap-2">
                                <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="btn-disabled btn-xs w-16 h-4 rounded-sm">accept</button>
                                <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="btn-disabled btn-xs w-16 h-4 rounded-sm">reject</button>
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
                        </div>
                      </div>
                    </div></div>
                )}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </>
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