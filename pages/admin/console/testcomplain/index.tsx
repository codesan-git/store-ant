import { Complain, Order } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import getData from "./action/getComplainAdmin";
import { getDataComplain } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  getComplain: getDataComplain[]
}

export default function ComplainAdmin({ getComplain }: Props) {

  const router = useRouter()
  const acceptStatus = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/admin/complain/accept`, {
        id: id
      }).then(() => router.refresh())

    } catch (error) {

    }
  };

  const rejectStatus = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/admin/complain/reject`, {
        id: id
      }).then(() => router.refresh())

    } catch (error) {

    }
  };
  console.log(getComplain)
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
        {getComplain.map((comp: any) => (
          <>
            {comp.order.OrderStatus === "ONGOING" && (
              <>
                <tbody>
                  <tr className="hover">
                    <th>{comp.id}</th>
                    <td className="flex gap-4">
                      {comp.image.split(",").map((kocak: string) => (
                        <>
                          <img
                            src={`http://localhost:3000\\${kocak}`}
                            className="w-16 h-16"
                          />
                        </>
                      ))}
                    </td>
                    <td>{comp.description}</td>
                    <td>{comp.status}</td>
                    <td>
                      <button onClick={() => acceptStatus(comp.order.id)} className="btn">accept</button>
                      <button onClick={() => rejectStatus(comp.order.id)} className="btn">reject</button></td>
                    <td>{comp.order.transaction.user.name}</td>
                    <td>{comp.order.transaction.shop.shopName}</td>
                    <td>{comp.order.product.name}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </>
            )}
          </>
        ))}
      </table>
    </div>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const complain = await getData()

  return {
    props: {
      getComplain: complain
    },
  };
}