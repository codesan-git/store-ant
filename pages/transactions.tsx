import React, { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import ProductCard from "./components/product_card";
import Navbar from "./navbar";
import Footer from "./footer";
import { Status } from "@prisma/client";
import type { TabsStylesType } from "@material-tailwind/react";

// TABS
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import ReviewModal from "./components/transactions/review-modal";
// END TABS

interface CartItems {
  cartItems: {
    id: Number;
    product: Product;
    count: Number;
    price: Number;
    status: Status;
  }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface CartId {
  id: Number;
}

export default function Transaction({ cartItems }: CartItems) {
  const router = useRouter();
  const { data: session } = useSession();
  let belumBayar = new Array();
  let dikemas = new Array();
  let dikirim = new Array();
  let selesai = new Array();
  let dibatalkan = new Array();
  let dikembalikan = new Array();

  const [openTab, setOpenTab] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [currentRateProductName, setCurrentRateProductName] = useState<String>("");
  const [currentCartItemId, setCurrentCartItemId] = useState<Number>();

  //  TABS
  const data = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "Profile",
      value: "profile",
      icon: UserCircleIcon,
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];
  //  END TABS

  if (cartItems) {
    let i: number;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.UNPAID) belumBayar.push(cartItems[i]);
    }
    console.log(belumBayar);

    for (i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].status === Status.PACKING ||
        cartItems[i].status === Status.CANCELING ||
        cartItems[i].status === Status.CANCEL_REJECTED
      )
        dikemas.push(cartItems[i]);
    }
    console.log(dikemas);

    for (i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].status === Status.DELIVERING ||
        cartItems[i].status === Status.RETURNING
      )
        dikirim.push(cartItems[i]);
    }
    console.log(dikirim);

    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.FINISHED) selesai.push(cartItems[i]);
    }
    console.log(selesai);

    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.CANCELED)
        dibatalkan.push(cartItems[i]);
    }
    console.log(dibatalkan);

    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].status === Status.RETURNED)
        dikembalikan.push(cartItems[i]);
    }
    console.log(dikembalikan);
  }

  async function onBayar(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/pay", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onCancel(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/cancel", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onFinish(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/finish", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onReturn(id: Number) {
    const cartId: CartId = { id: id };
    try {
      fetch("http://localhost:3000/api/cart/return", {
        body: JSON.stringify(cartId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }).then(() => router.reload());
    } catch (error) {
      //console.log(error)
    }
  }

  async function onRate(id: Number) {
    console.log("CLICK, ID: ", id);
    router.push({
      pathname: "http://localhost:3000/rate",
      query: { id: String(id) },
    });
  }

  const onRateClick = (productName: String, cartItemId: Number) => {
    setCurrentRateProductName(productName); 
    setCurrentCartItemId(cartItemId);
  }

  const getCurrentSelectedProductForRate = () => {
    console.log(`returning ${currentRateProductName} and ${currentCartItemId?.toString()}`);
    return {
      currentRateProductName,
      currentCartItemId
    };
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-4 lg:mt-12 gap-y-1">
        <div className="flex flex-wrap">
          <div className="w-full">
            <nav className="overflow-x-auto">
              <ul
                className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-auto"
                role="tablist"
              >
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 1
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <i className="fas fa-space-shuttle text-base mr-1"></i>{" "}
                    Belum Bayar
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 2
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    data-toggle="tab"
                    href="#link2"
                    role="tablist"
                  >
                    <i className="fas fa-cog text-base mr-1"></i> Dikemas
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 3
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(3);
                    }}
                    data-toggle="tab"
                    href="#link3"
                    role="tablist"
                  >
                    <i className="fas fa-briefcase text-base mr-1"></i> Dikirim
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 4
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(4);
                    }}
                    data-toggle="tab"
                    href="#link4"
                    role="tablist"
                  >
                    <i className="fas fa-cog text-base mr-1"></i> Selesai
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 5
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(5);
                    }}
                    data-toggle="tab"
                    href="#link5"
                    role="tablist"
                  >
                    <i className="fas fa-cog text-base mr-1"></i> Dibatalkan
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 6
                        ? "text-white bg-primary"
                        : "text-primary bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(6);
                    }}
                    data-toggle="tab"
                    href="#link6"
                    role="tablist"
                  >
                    <i className="fas fa-cog text-base mr-1"></i> Dikembalikan
                  </a>
                </li>
              </ul>
            </nav>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div
                    className={openTab === 1 ? "block" : "hidden"}
                    id="link1"
                  >
                    {belumBayar.length !== 0 ? (
                      <div>
                        {belumBayar.map((cartItem) => (
                          <div
                            className="card shadow-xl text-md my-5"
                            key={String(cartItem.id)}
                          >
                            <div className="flex flex-col w-full lg:flex-row">
                              <div className="grid flex-grow card-body py-5 my-5 place-items-center lg:place-items-start">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                      className="h-full w-full bg-no-repeat bg-center bg-cover"
                                    />
                                  ) : (
                                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                  )}
                                </figure>
                              </div>
                              <div className="divider lg:divider-horizontal"></div>
                              <div className="grid flex-grow w-full my-auto place-items-center lg:place-items-start">
                                <h2 className="card-title">
                                  {cartItem.product.name}
                                </h2>
                                <div className="py-5 flex w-full">
                                  <div className="w-full">
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
                                  </div>
                                  <div className="w-1/3 my-auto px-10 border-l-2 border-primary">
                                    <p className="disabled">Total Harga</p>
                                    <p>Rp. {cartItem.product.price}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => onBayar(Number(cartItem.id))}
                                  className="w-32 btn btn-sm btn-primary rounded-md"
                                >
                                  Bayar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No on going transaction</p>
                    )}
                  </div>
                  <div
                    className={openTab === 2 ? "block" : "hidden"}
                    id="link2"
                  >
                    {dikemas.length !== 0 ? (
                      <div>
                        {dikemas.map((cartItem) => (
                          <div
                            className="card bg-base-100 shadow-xl text-md my-5"
                            key={String(cartItem.id)}
                          >
                            <div className="flex">
                              <div className="card-body py-5 my-5">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                      className="w-full h-full"
                                    />
                                  ) : (
                                    <img
                                      src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                                      className="w-full h-full"
                                    />
                                  )}
                                </figure>
                              </div>
                              <div className="w-full my-auto">
                                <div className="py-5 px-10 flex w-full">
                                  <div>
                                    <h2 className="card-title">
                                      {cartItem.product.name}
                                    </h2>
                                    <p>{cartItem.product.price}</p>
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
                                    {cartItem.status === Status.CANCELING ? (
                                      <button
                                        disabled={true}
                                        className="w-32 btn btn-sm btn-primary rounded-md"
                                      >
                                        Pembatalan Diajukan
                                      </button>
                                    ) : (
                                      <button
                                        disabled={
                                          cartItem.status ===
                                          Status.CANCEL_REJECTED
                                            ? true
                                            : false
                                        }
                                        onClick={() =>
                                          onCancel(Number(cartItem.id))
                                        }
                                        className="w-32 btn btn-sm btn-primary rounded-md"
                                      >
                                        Batalkan
                                      </button>
                                    )}
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
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    {dikirim.length !== 0 ? (
                      <div>
                        {dikirim.map((cartItem) => (
                          <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                          >
                            <div className="flex">
                              <div className="card-body py-5">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                    />
                                  ) : (
                                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                  )}
                                </figure>
                              </div>
                              <div className="w-full">
                                <div className="py-5 px-10 flex w-full">
                                  <div>
                                    <h2 className="card-title">
                                      {cartItem.product.name}
                                    </h2>
                                    <p>{cartItem.product.price}</p>
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
                                    {cartItem.status === Status.RETURNING ? (
                                      <button
                                        disabled={true}
                                        className="w-32 btn btn-primary"
                                      >
                                        Pengembalian Diajukan
                                      </button>
                                    ) : (
                                      <div className="flex gap-x-2">
                                        <button className="w-16 btn btn-primary">
                                          Lacak
                                        </button>
                                        <button
                                          onClick={() =>
                                            onFinish(Number(cartItem.id))
                                          }
                                          className="w-16 btn btn-primary"
                                        >
                                          Selesai
                                        </button>
                                        <button
                                          onClick={() =>
                                            onReturn(Number(cartItem.id))
                                          }
                                          className="w-32 btn btn-primary"
                                        >
                                          Kembalikan
                                        </button>
                                      </div>
                                    )}
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
                  <div
                    className={openTab === 4 ? "block" : "hidden"}
                    id="link4"
                  >
                    {selesai.length !== 0 ? (
                      <div>
                        {selesai.map((cartItem) => (
                          <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                          >
                            <div className="flex">
                              <div className="card-body py-5">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                    />
                                  ) : (
                                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                  )}
                                </figure>
                              </div>
                              <div className="w-full">
                                <div className="py-5 px-10 flex w-full">
                                  <div>
                                    <h2 className="card-title">
                                      {cartItem.product.name}
                                    </h2>
                                    <p>{cartItem.product.price}</p>
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
                                    <label onClick={() => onRateClick(cartItem.product.name,cartItem.id)} htmlFor={`review-modal`} className="w-32 btn btn-primary">Rate</label>
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
                  <div
                    className={openTab === 5 ? "block" : "hidden"}
                    id="link5"
                  >
                    {dibatalkan.length !== 0 ? (
                      <div>
                        {dibatalkan.map((cartItem) => (
                          <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                          >
                            <div className="flex">
                              <div className="card-body py-5">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                    />
                                  ) : (
                                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                  )}
                                </figure>
                              </div>
                              <div className="w-full">
                                <div className="py-5 px-10 flex w-full">
                                  <div>
                                    <h2 className="card-title">
                                      {cartItem.product.name}
                                    </h2>
                                    <p>{cartItem.product.price}</p>
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
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
                  <div
                    className={openTab === 6 ? "block" : "hidden"}
                    id="link6"
                  >
                    {dikembalikan.length !== 0 ? (
                      <div>
                        {dikembalikan.map((cartItem) => (
                          <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                          >
                            <div className="flex">
                              <div className="card-body py-5">
                                <figure className="rounded-md h-40 w-40">
                                  {cartItem.product.image ? (
                                    <img
                                      src={`http://localhost:3000/${cartItem.product.image.split(",")[0]}`}
                                    />
                                  ) : (
                                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                  )}
                                </figure>
                              </div>
                              <div className="w-full">
                                <div className="py-5 px-10 flex w-full">
                                  <div>
                                    <h2 className="card-title">
                                      {cartItem.product.name}
                                    </h2>
                                    <p>{cartItem.product.price}</p>
                                    <p>{cartItem.count}</p>
                                    <p>{cartItem.status}</p>
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
              </div>
            </div>
          </div>
        </div>
        <ReviewModal htmlElementId={`review-modal`}  selectProductCallback={getCurrentSelectedProductForRate}/>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const cart = await prisma.cart.findFirst({
    where: { userId: session?.user.id },
  });

  if (!cart) {
    return {
      props: {},
    };
  }

  const cartItems = await prisma.productInCart.findMany({
    where: {
      AND: [{ cartId: cart?.id }, { status: { not: Status.INCART } }],
    },
    select: {
      id: true,
      product: true,
      count: true,
      status: true,
    },
  });
  return {
    props: {
      cartItems,
    },
  };
};
