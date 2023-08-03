import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { User, Shop, OrderStatus } from "@prisma/client";
import Navbar from "../navbar";

interface ComplainData {
  complain: {
    id: number;
    image: string;
    description: string;
    order: Order;
  };
}

interface Order {
  id: Number;
  transaction: Transaction;
  product: Product;
  status: OrderStatus;
}

interface Transaction {
  user: User;
}

interface Product {
  id: Number;
  name: string;
  price: Number;
  image: string;
  shop: Shop;
}

interface CartId {
  id: Number;
}

export default function Detail({ complain }: ComplainData) {
  const router = useRouter();

  async function onReturn(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('/api/shop/rejectreturn', {
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

  async function onReject(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('/api/shop/rejectreturn', {
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

  console.log(complain);
  return (
    <div>
      <Navbar/>
      <div
        className="card bg-base-100 shadow-xl text-md"
        key={String(complain.id)}
      >
        <div>
          <div className="card-body py-5">
            {complain.image ? (
              <div className="rounded-md h-40 w-40 flex gap-5">
                {complain.image.split(",").map((image) => (
                  <img
                    className="rounded-md w-40 h-40"
                    src={image}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src =
                        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
                    }}
                  />
                ))}
              </div>
            ) : (
              <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
            )}
          </div>
          <div className="w-full">
            <div className="py-5 px-10 flex w-full">
              <div>
                <p>Complain By: {complain.order.transaction.user.name}</p>
                <p>Product: {complain.order.product.name}</p>
                <p>Shop: {complain.order.product.shop.shopName}</p>
                <p>Deskripsi: {complain.description}</p>
                <p>
                  Status:{" "}
                  {complain.order.status === OrderStatus.NEED_ADMIN_REVIEW
                    ? "Toko menolak pengembalian, menunggu tanggapan admin"
                    : "Menunggu tanggapan toko"}{" "}
                </p>
                <div>
                  {complain.order.status === OrderStatus.RETURNED || complain.order.status === OrderStatus.RETURN_REJECTED ? (
                    <div>
                        <p>Persetujuan {complain.order.status === OrderStatus.RETURNED ? "Diterima" : "Ditolak"}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const complain = await prisma.complain.findFirst({
    where: { orderId: Number(id) },
    select: {
      id: true,
      image: true,
      description: true,
      order: {
        select: {
          transaction: {
            select: {
              user: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              shop: true,
            },
          },
          OrderStatus: true,
          id: true
        },
      },
    },
  });

  return {
    props: {
      complain: JSON.parse(JSON.stringify(complain)),
    },
  };
};
