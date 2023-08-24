import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { Address, Product, Profile, Shop, User, Category } from "@prisma/client";
import { HiShoppingCart } from "react-icons/hi";
import { RxDotFilled } from "react-icons/rx";
import Navbar from "./navbar";
import Footer from "./footer";
import ProductCard from "@/components/index/product_card";
import styles from "../styles/Home.module.css";
import { useState, Dispatch, useEffect } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import CategoryListItem from "@/components/index/category_list_item";
import Image from "next/image";
import { select } from "@material-tailwind/react";
import ProductItem from "@/components/shop/product_item";

async function handleGoogleSignOut() {
  signOut({ callbackUrl: "/login" });
}


interface Sort {
  _sort: string;
}
interface Order {
  name: string;
}

interface Props {
  products: (Product &
  {
    shop: Shop
    & {
      user: User
      & {
        profile: Profile
        & {
          addresses: Address[]
        }
      }
    },
    category: Category
  })[],
  events: Event[];
}

interface Event {
  id: number;
  eventName: string;
  eventPath: string;
  startDate: Date;
  endDate: Date;
  image: string;
}

export default function Home({ events, products }: Props) {
  const { data: session } = useSession();
  const [sortSort, setSortSort] = useState<Sort>({ _sort: "id" });
  // const [sortOrder, setSortOrder] = useState<Order>({ _order: "desc" });
  const [sortDir, setSortDir] = useState("desc");
  const [sortBy, setSortBy] = useState("id");
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(events[0]?.image);

  const search = useSearchParams();
  const searchQuery = search.get("_sort");
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const fetchCategories = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch Categories for Navbar");

    return response.json();
  }

  const { data: categoryData, isLoading: categoryDataIsLoading } = useSWR<{ categories: Array<Category> }>(
    `/api/category/`,
    fetchCategories
  );

  const onFilter = (categoryId: number) => {
    const encodedSearchQuery = encodeURI(categoryId.toString());
    router.push(`/filter?q=${encodedSearchQuery}`);
  }

  const routeToProduct = (productId: number) => {
    router.push({
      pathname: "/product/detail/",
      query: { id: String(productId) }
    });
  }

  const handleNodemailer = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    let data = {
      email: session?.user.email!,
    };

    fetch("/api/contact", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        setSubmitted(true);
      }
    });
  };

  function navigateCarousel(i: number) {
    //console.log("CLICK, INDEX: ", i);
    if (i >= events.length)
      i = 0;
    if (i < 0)
      i = events.length - 1;
    setSelectedImage(events[i]?.image);
    setIndex(i);
  }

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <Navbar />
      <div id="content" className="p-2 space-y-8">
        <div id="category-list" className=" carousel carousel-center p-4 h-28 space-x-1 items-center shadow rounded-md lg:hidden">
          {
            categoryDataIsLoading
              ? null
              : categoryData?.categories.map((category) => <CategoryListItem category={category} onClick={onFilter} key={category.id.valueOf()} />)
          }
        </div>
        <div id="product-carousel-container" className="relative flex justify-center">
          <div id="product-carousel" className="carousel w-full rounded-lg lg:w-3/4 lg:h-96">
            <div id="slide1" className="carousel-item relative w-full transition duration-700 ease-in-out hover:cursor-pointer">
              <Image
                src={events[0].image}
                alt=""
                width={1500}
                height={1500}
                className="w-full object-cover"
                onClick={() => window.open(events[index]?.eventPath)}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                }}
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button onClick={() => navigateCarousel(index - 1)} className="btn btn-circle btn-sm lg:btn-md">❮</button>
                <button onClick={() => navigateCarousel(index + 1)} className="btn btn-circle btn-sm lg:btn-md">❯</button>
              </div>
            </div>
          </div>
          <div id='slide-button-group-container' className=" absolute w-full bottom-0 left-0">
            <div className="flex justify-center w-full py-2 gap-2">
              {events.map((eventData, i) => (
                <button key={i} onClick={() => navigateCarousel(i)} className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></button>
              ))}
            </div>
          </div>
        </div>
        <div id="product-list-container" className="flex justify-center ">
          <div className="lg:w-3/4 flex justify-center items-center">
            <div id="product-list" className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-2 xl:gap-4 2xl:gap-8">
              {products.map((product) => <ProductCard onClick={() => routeToProduct(product.id)} product={product} key={product.id} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();

  const products = await prisma.product.findMany({
    where: {
      stock: { gt: 0 }
    },
    orderBy: {
      id: 'desc'
    },
    include: {
      category: true,
      shop: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: {
                include: {
                  addresses: {
                    select: {
                      city: true
                    },
                    where: {
                      isShopAddress: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return {
    props: {
      products: products,
      events: JSON.parse(JSON.stringify(events))
    },
  };
};