import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { User, Shop, Status } from "@prisma/client";
import Navbar from "../navbar";

interface ComplainData {
  complain: {
    id: number;
    image: string;
    description: string;
    productInCart: ProductInCart;
  };
}

interface ProductInCart {
  id: Number;
  cart: Cart;
  product: Product;
  status: Status;
}

interface Cart {
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
        fetch('http://localhost:3000/api/shop/rejectreturn', {
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
        fetch('http://localhost:3000/api/shop/rejectreturn', {
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
                    src={`http://localhost:3000/${image}`}
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
                <p>Complain By: {complain.productInCart.cart.user.name}</p>
                <p>Product: {complain.productInCart.product.name}</p>
                <p>Shop: {complain.productInCart.product.shop.shopName}</p>
                <p>Deskripsi: {complain.description}</p>
                <p>
                  Status:{" "}
                  {complain.productInCart.status === Status.NEED_ADMIN_REVIEW
                    ? "Toko menolak pengembalian, menunggu tanggapan admin"
                    : "Menunggu tanggapan toko"}{" "}
                </p>
                <div>
                  {complain.productInCart.status === Status.RETURNED || complain.productInCart.status === Status.RETURN_REJECTED ? (
                    <div>
                        <p>Persetujuan {complain.productInCart.status === Status.RETURNED ? "Diterima" : "Ditolak"}</p>
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
    where: { productInCartId: Number(id) },
    select: {
      id: true,
      image: true,
      description: true,
      productInCart: {
        select: {
          cart: {
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
          status: true,
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
