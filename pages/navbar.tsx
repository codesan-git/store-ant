import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import { HiShoppingCart, HiBell } from "react-icons/hi";
import { useState } from 'react';
import { Category, NotifRole, NotifType, User, Shop } from "@prisma/client";
import useSWR from 'swr';
import { InferGetServerSidePropsType } from "next";
import LoginDropdown from "@/components/navbar/login_dropdown";
import axios from "axios";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from "next/image";

interface CartItems {
  id: Number;
  product: Product;
  count: Number;
  price: Number;
}

interface Product {
  id: string;
  name: string;
  price: Number;
  stock: Number;
  image: string;
}

interface Notification {
  id: number;
  body: string;
  notifType: NotifType;
  notifRole: NotifRole;
  isSeen: boolean;
  senderId: string | null;
}

// interface Messages {
//   messages: MessageForm;
//   recipient: User;
//   shop: Shop;
//   //conversation: Conversation;
// }

// interface MessageForm {
//   senderId: string;
//   recipientId: string;
//   message: string;
// }

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

async function handleGoogleSignOut() {
  signOut({ callbackUrl: "/login" });
}


const fetchCategories = async (url: string) => {

  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch Categories for Navbar");

  return response.json();
}

// export default function 
const Navbar = (  ) => {
  console.log()
  const [value, setValue] = useState(0);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { data: categoryData, isLoading } = useSWR<{ categories: Array<Category> }>(
    `/api/category/`,
    fetchCategories
  )

  const { data: session } = useSession();
  const router = useRouter();
  // const onChatClick = () => {
  //   router.push(`/chat?newChatUserId=${senderId}`);
  // }
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const { data: cartItems, isLoading: loadingCart } = useSWR<{ productInCart: Array<CartItems> }>(
    `/api/cart/`,
    fetchCategories
  )

  const { data: count, isLoading: loadingCount } = useSWR<{ count: number }>(
    `/api/notification/count/`,
    fetchCategories,
    { refreshInterval: 30000 }
  )

  let price = 0;
  if (cartItems) {
    let i: number;
    if (cartItems.productInCart) {
      for (i = 0; i < cartItems.productInCart.length; i++) {
        price += (Number(cartItems.productInCart[i].count) * Number(cartItems.productInCart[i].product.price));
      }
    }
  }

  const [query, setQuery] = useState('');
  const [notif, setNotif] = useState<Notification[]>();

  async function getNotif() {
    const res = await axios.get("/api/notification");
    setNotif(res.data.notifications);
    ////console.log("notif: ", res.data.notifications);
  }

  async function readNotif() {
    //console.log("read");
    const res = await axios.put("/api/notification/read");
  }

  useEffect(() => {
    getNotif();
  }, []);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(query);
    router.push(`/search?q=${encodedSearchQuery}`);
    ////console.log(encodedSearchQuery);
  }

  function onFilter(categoryId: string) {
    const encodedSearchQuery = encodeURI(categoryId);
    router.push(`/filter?q=${encodedSearchQuery}`);
    ////console.log(encodedSearchQuery);
  }

  ////console.log("profile ", session?.user.image);

  if (!categoryData?.categories) {

    return null
  }

  function onNotifClick(type: NotifType, role: NotifRole) {
    //console.log("click notif");
    if (type == NotifType.CHAT) {

    } else {
      if (role == NotifRole.SELLER) {
        router.push("/shop/");
      } else {
        router.push("/transactions/");
      }
    }
  }

  return (
    <div className="w-full sticky top-2 z-50">
      {/* New Navbar */}
      <div className="navbar bg-base-100 sm:px-1 lg:px-32 shadow">
        <div className="navbar-start">
          <div className="flex-1 lg:mx-16">
            <Link className="btn btn-ghost normal-case text-xl text-primary-focus" href="/" passHref>
              Store{" "}
              <span className="text-indigo-700 to-secondary-focus">.</span>
              <span className="text-secondary-focus">ant</span>
            </Link>
            {/* Dropdown */}
            <div className="dropdown dropdown-hover sm:mr-4">
              <label
                tabIndex={0}
                className="mx-2 btn btn-link no-underline text-accent-content hidden xl:flex"
              >
                kategori
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {categoryData.categories.map(
                  category => (
                    <li key={category.id}>
                      <a onClick={() => onFilter(String(category.id))}>{category.category}</a>
                    </li>
                  )
                )}
              </ul>
            </div>
            {/* End Dropdown */}
          </div>
        </div>
        <div className="navbar-center hidden sm:inline lg:flex w-1/4">
          <form onSubmit={onSearch} className="w-full">
            <input
              type="text"
              placeholder="Belanja sekarang"
              className="input input-bordered input-primary input-sm w-full placeholder-primary-focus"
              value={query}
              onChange={e => { setQuery(e.target.value); }}
            />
          </form>
        </div>
        <div className="navbar-end">
          {/* Session Login */}
          {session ? (
            <div className="flex">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle mr-5">
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {cartItems ? (
                      <span className="badge badge-sm indicator-item ">{cartItems.productInCart?.length}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                </label>
                <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                  <div className="card-body">
                    {cartItems ? (
                      <span className="font-bold text-lg">{cartItems.productInCart?.length} Items</span>
                    ) : (
                      <span className="font-bold text-lg">No Items Yet</span>
                    )}
                    <span className="text-info">Subtotal: Rp.{price}</span>
                    <div className="card-actions">
                      <button onClick={() => router.push('/cart')} className="btn btn-primary btn-block">
                        View cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* notif */}
              <div className="dropdown dropdown-end" onClick={() => { getNotif(); readNotif(); }}>
                <label tabIndex={0} className="btn btn-ghost m-1 text-lg">
                  <HiBell className="hidden sm:block" />
                  <div className="indicator">
                    {count?.count! > 0 ? (
                      <span className="badge badge-sm indicator-item">{count?.count!}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                </label>
                <div tabIndex={0} className="mt-3 card dropdown-content bg-base-100 shadow">
                  <div className="card-body h-[400px] w-[400px] overflow-y-scroll">
                    <Box>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Chat" {...a11yProps(0)} />
                          <Tab label="Transaction" {...a11yProps(1)} />
                          <Tab label="Order" {...a11yProps(2)} />
                        </Tabs>
                      </Box>
                      {notif?.map((notif) => (
                        <div key={notif.id} className="cursor-pointer hover:bg-gray-300 overflow-y-auto" onClick={() => onNotifClick(notif.notifType, notif.notifRole)}>

                          {Boolean(notif.notifType === "CHAT") &&
                            <CustomTabPanel value={value} index={0}>
                              <div onClick={()=>router.push(`/chat?newChatUserId=${notif.senderId}`)}>{notif.body}</div>
                            </CustomTabPanel>
                          }
                          {notif.notifType === "TRANSACTION" && notif.notifRole === "USER" ?
                            <>
                              <CustomTabPanel value={value} index={1}>
                                <div>{notif.body}</div>
                              </CustomTabPanel>
                            </>
                            :
                            <>
                            </>
                          }
                          {notif.notifType === "TRANSACTION" && notif.notifRole === "SELLER" ?
                            <>
                              <CustomTabPanel value={value} index={2}>
                                <div>{notif.body}</div>
                              </CustomTabPanel>
                            </>
                            :
                            <></>
                          }
                        </div>
                      ))}
                    </Box>
                  </div>
                </div>
              </div>
              <LoginDropdown onLogoutClick={handleGoogleSignOut} session={session} />
            </div>
          ) : (
            <>
              {/* Dropdown Chart */}
              <div className="dropdown dropdown-hover dropdown-left mx-5">
                <label tabIndex={0} className="btn btn-ghost m-1 text-lg">
                  <HiShoppingCart className="hidden sm:block" />
                </label>
                <div
                  tabIndex={0}
                  className="dropdown-content card card-compact w-96 p-2 shadow bg-primary text-primary-content glass"
                >
                  <div className="card-body bg-primary rounded-lg">
                    <h2 className="card-title">Life hack</h2>
                    <p>How to park your car at your garage?</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Learn now!</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Dropdown Chart */}
              <p className="hidden sm:block text-primary-focus mx-5">|</p>
              <Link
                className="btn btn-outline btn-primary text-md btn-sm text-gray-100 lg:mx-4"
                href="/login"
              >
                Daftar
              </Link>
              <Link
                className="btn btn-primary btn-sm text-md text-gray-100 lg:mx-4"
                href="/login"
              >
                Masuk
              </Link>
            </>
          )}
          {/* End Session Login */}
        </div>
      </div>
      <form className='mt-4 sm:hidden' onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Shop now"
          className="input input-bordered input-primary input-sm w-full placeholder-primary-focus"
          value={query}
          onChange={e => { setQuery(e.target.value); }}
        />
      </form>
      {/* End New Navbar */}

    </div>
  );
}

export default Navbar;