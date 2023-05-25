import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { User, Shop, Status } from "@prisma/client";
import { getSession } from "next-auth/react";
import Navbar from "@/pages/navbar";

interface Complain {
  complains: {
    id: number;
    image: string;
    description: string;
    productInCart: ProductInCart;
  }[];
}

interface ProductInCart {
  id: number;
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

export default function Complains({ complains }: Complain) {
  const router = useRouter();
  console.log(complains);

  async function onDetail(id: string) {
    router.push({
      pathname: "complain/detail/",
      query: { id: id },
    });
  }

  return (
    <div>
      <Navbar />
      <div>
        <p className="card-title">Complains</p>
      </div>
      <div className="mt-5">
        {complains.length !== 0 ? (
          <div>
            {complains.map((complain) => (
              <div
                className="card bg-base-100 shadow-xl text-md"
                key={String(complain.id)}
              >
                <div className="flex">
                  <div className="card-body py-5">
                    <figure className="rounded-md h-40 w-40">
                      {complain.image ? (
                        <img
                          src={`http://localhost:3000/${
                            complain.image.split(",")[0]
                          }`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src =
                              "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
                          }}
                        />
                      ) : (
                        <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                      )}
                    </figure>
                  </div>
                  <div className="w-full">
                    <div className="py-5 px-10 flex w-full">
                      <div>
                        <p>
                          Complain By: {complain.productInCart.cart.user.name}
                        </p>
                        <p>Product: {complain.productInCart.product.name}</p>
                        <p>
                          Shop: {complain.productInCart.product.shop.shopName}
                        </p>
                        <p>Deskripsi: {complain.description}</p>
                        <p>
                          Status:{" "}
                          {complain.productInCart.status ===
                          Status.NEED_ADMIN_REVIEW
                            ? "Menunggu tanggapan admin"
                            : complain.productInCart.status === Status.RETURNED
                            ? "Pengajuan diterima"
                            : "Menunggu tanggapan toko"}{" "}
                        </p>
                        <div className="card-actions my-2">
                          <button
                            className="w-16 btn btn-primary"
                            onClick={() => onDetail(complain.id.toString())}
                          >
                            Lihat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No on going transaction</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const complain = await prisma.complain.findMany({
    where: {
      productInCart: {
        product: {
          shop: { userId: session?.user.id },
        },
      },
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
          id: true,
        },
      },
    },
  });

  return {
    props: {
      complains: JSON.parse(JSON.stringify(complain)),
    },
  };
};
