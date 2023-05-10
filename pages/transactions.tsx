import React from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/product_card";
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

  async function onRate(id: Number){
    console.log("CLICK, ID: ", id);
    router.push({
        pathname: "http://localhost:3000/rate",
        query: {id: String(id)}
    });
  }

  return (
    <>
      <Navbar />
      <div className="flex-row lg:flex">
        <div
          className={` ${
            open ? "lg:w-40" : "lg:w-60 "
          } flex flex-col lg:h-screen p-3 w-full bg-gray-800 shadow duration-300`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
              <button onClick={() => setOpen(!open)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center py-4">
                <button
                  type="submit"
                  className="p-2 focus:outline-none focus:ring"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </span>
              <input
                type="search"
                name="Search"
                placeholder="Search..."
                className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                <li className="rounded-sm">
                  <Link
                    href="/"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="text-gray-100">Home</span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="mail"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span className="text-gray-100">Inbox</span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/orders"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text-gray-100">Orders</span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="settings"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-gray-100">Settings</span>
                  </Link>
                </li>
                <li className="rounded-sm">
                  <Link
                    href="/logout"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-gray-100">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-4 lg:mt-12">
          {/* Here */}
          <div className="flex flex-wrap">
            <div className="w-full">
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
                              className="card bg-base-100 shadow-xl text-md"
                              key={String(cartItem.id)}
                            >
                              <div className="flex">
                                <div className="card-body py-5 w-auto">
                                  <figure className="rounded-md h-52 w-52 m-auto">
                                    {cartItem.product.image ? (
                                      <img
                                        src={`http://localhost:3000/${cartItem.product.image}`}
                                      />
                                    ) : (
                                      <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
                                    )}
                                  </figure>
                                </div>
                                <div className="w-full">
                                  <div className="py-5 px-10 flex w-full">
                                    <div className="w-full">
                                      <h2 className="card-title">
                                        {cartItem.product.name}
                                      </h2>
                                      <p>{cartItem.product.price}</p>
                                      <p>{cartItem.count}</p>
                                      <p>{cartItem.status}</p>
                                      <button
                                        onClick={() =>
                                          onBayar(Number(cartItem.id))
                                        }
                                        className="w-32 btn btn-primary"
                                      >
                                        Bayar
                                      </button>
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
                      className={openTab === 2 ? "block" : "hidden"}
                      id="link2"
                    >
                      {dikemas.length !== 0 ? (
                        <div>
                          {dikemas.map((cartItem) => (
                            <div
                              className="card bg-base-100 shadow-xl text-md"
                              key={String(cartItem.id)}
                            >
                              <div className="flex">
                                <div className="card-body py-5">
                                  <figure className="rounded-md h-40 w-40">
                                    {cartItem.product.image ? (
                                      <img
                                        src={`http://localhost:3000/${cartItem.product.image}`}
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
                                      {cartItem.status === Status.CANCELING ? (
                                        <button
                                          disabled={true}
                                          className="w-32 btn btn-primary"
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
                                          className="w-32 btn btn-primary"
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
                                        src={`http://localhost:3000/${cartItem.product.image}`}
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
                                        src={`http://localhost:3000/${cartItem.product.image}`}
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
                                      <button onClick={()=> onRate(cartItem.id)} className="w-32 btn btn-primary">Nilai</button>
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
                      {dikemas.length !== 0 ? (
                        <div>
                          {dikemas.map((cartItem) => (
                            <div
                              className="card bg-base-100 shadow-xl text-md"
                              key={String(cartItem.id)}
                            >
                              <div className="flex">
                                <div className="card-body py-5">
                                  <figure className="rounded-md h-40 w-40">
                                    {cartItem.product.image ? (
                                      <img
                                        src={`http://localhost:3000/${cartItem.product.image}`}
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
                                      {cartItem.status === Status.CANCELING ? (
                                        <button
                                          disabled={true}
                                          className="w-32 btn btn-primary"
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
                                          className="w-32 btn btn-primary"
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
                                        src={`http://localhost:3000/${cartItem.product.image}`}
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
        </div>
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

  console.log(cartItems);
  return {
    props: {
      cartItems,
    },
  };
};
