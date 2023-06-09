import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { User, Shop, Status } from "@prisma/client";

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
  const {id} = router.query;

  async function onReturn() {
    const cartId: CartId = {id: Number(id)};
    try{
        fetch('http://localhost:3000/api/shop/return', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.push({pathname: 'http://localhost:3000/shop/complain/refund', query: {id: id}}))
      }catch(error){
          //console.log(error)
      }
  }

  async function onReject() {
    router.push({
      pathname: "http://localhost:3000/shop/complain/response/create",
      query: {id: complain.id}
    })
  }
  
  async function onCommentDetail() {
    router.push({
      pathname: "http://localhost:3000/shop/complain/response/detail",
      query: {id: complain.id}
    })
  }

  console.log(complain);
  return (
    <div>
      <div
        className="card bg-base-100 shadow-xl text-md"
        key={String(complain?.id)}
      >
        <div>
          <div className="card-body py-5">
            {complain?.image ? (
              <div className="rounded-md h-40 w-40 flex gap-5">
                {complain?.image.split(",").map((image) => (
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
                <p>Complain By: {complain?.productInCart.cart.user.name}</p>
                <p>Product: {complain?.productInCart.product.name}</p>
                <p>Shop: {complain?.productInCart.product.shop.shopName}</p>
                <p>Deskripsi: {complain?.description}</p>
                {complain?.productInCart.status === Status.NEED_ADMIN_REVIEW ? (
                    <p>
                      Status: Toko menolak pengembalian, menunggu tanggapan admin
                    </p>
                  ) : (
                    <div>
                      {complain?.productInCart.status === Status.RETURNED ? (
                        <p>
                          Status: Pengembalian Disetujui
                        </p>
                      ) : (
                        <p>
                          Status: Menunggu tanggapan toko
                        </p>
                      )}
                    </div>
                  ) 
                }
                
                <div>
                  {complain?.productInCart.status === Status.RETURNED || complain?.productInCart.status === Status.RETURN_REJECTED ? (
                    <div>
                        <p>Persetujuan {complain?.productInCart.status === Status.RETURNED ? "Diterima" : "Ditolak"}</p>
                    </div>
                  ) : (
                    <div>
                      {complain?.productInCart.status === Status.RETURNING ? (
                        <div  className="card-actions my-2">
                            <button
                                onClick={() => onReturn()}
                                className="w-32 btn btn-primary"
                            >
                                Setujui
                            </button>
                            <button
                                onClick={() => onReject()}
                                className="w-32 btn btn-primary"
                            >
                                Tolak
                            </button>
                        </div>
                      ) : (
                        <div  className="card-actions my-2">
                            <button
                                onClick={() => onCommentDetail()}
                                className="w-64 btn btn-primary"
                            >
                                Lihat Komentar Toko
                            </button>
                        </div>
                      )}
                    </div>
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
    where: { 
      productInCart: {id: Number(id)}
     },
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
