import { GetServerSideProps } from "next";
import getData from "./action/getComplainAdmin";
import { getDataComplain } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

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
  console.log(getComplain[3])
  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Description</th>
            <th>Status Complain</th>
            <th>Status Order</th>
            <th>Nama Buyer</th>
            <th>Nama Toko</th>
            <th>Product</th>
            <th>Seller Reason</th>
            <th>Seller Image</th>
            <th>Action Complain</th>
          </tr>
        </thead>
        {getComplain.map((comp: any) => (
          <Fragment key={comp.id}>
            {/* {comp.status === "OPEN" && (
              <> */}
            <tbody>
              <tr className="hover">
                <th>{comp.id}</th>
                <td className="flex gap-4">
                  {comp.image.split(",").map((kocak: string) => (
                    <img
                      key={kocak}
                      src={`http://localhost:3000\\${kocak}`}
                      className="w-16 h-16"
                    />
                  ))}
                </td>
                <td>{comp.description}</td>
                <td>{comp.status}</td>
                <td>{comp.order.OrderStatus}</td>
                <td>{comp.order.transaction.user.name}</td>
                <td>{comp.order.transaction.shop.shopName}</td>
                <td>{comp.order.product.name}</td>
                <td>{comp.ShopComment.description}</td>
                <td className="flex gap-4">
                  {comp.ShopComment.image?.split(",").map((kocak: string) => (
                    <img
                      key={kocak}
                      src={`http://localhost:3000\\${kocak}`}
                      className="w-16 h-16"
                    />
                  ))}
                </td>
                <td>
                  {comp.order.OrderStatus === "NEED_ADMIN_REVIEW" ?
                    <>
                      <div className="flex gap-2">
                        <button onClick={() => acceptStatus(comp.order.id)} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                        <button onClick={() => rejectStatus(comp.order.id)} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                      </div>

                    </>
                    :
                    <>
                      <div className="flex gap-2">
                        <button onClick={() => acceptStatus(comp.order.id)} className="btn-disabled w-16 h-8 rounded-sm">accept</button>
                        <button onClick={() => rejectStatus(comp.order.id)} className="btn-disabled w-16 h-8 rounded-sm">reject</button>
                      </div>
                    </>
                  }
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
            {/* </>
            )} */}
          </Fragment>
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