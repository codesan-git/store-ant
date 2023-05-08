import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { Category } from "@prisma/client";
import { HiShoppingCart } from "react-icons/hi";
import { RxDotFilled } from "react-icons/rx";
import Navbar from "./navbar";
import Footer from "./footer";
import ProductCard from "@/components/product_card";
import styles from "../styles/Home.module.css";

// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
import { useState, Dispatch, useEffect } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import CategoryListItem from "@/components/category_list_item";

async function handleGoogleSignOut() {
  signOut({ callbackUrl: "http://localhost:3000/login" });
}

interface Products {
  products: {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: Category;
    image: string;
  }[];
}


interface Sort {
  _sort: string;
}
interface Order {
  name: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [sortSort, setSortSort] = useState<Sort>({ _sort: "id" });
  // const [sortOrder, setSortOrder] = useState<Order>({ _order: "desc" });
  const [sortDir, setSortDir] = useState("desc");
  const [sortBy, setSortBy] = useState("id");
  const [products, setProducts] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const search = useSearchParams();
  const searchQuery = search.get("_sort");
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const { data, isLoading } = useSWR<{ products: Array<Products> }>(
    `/api/product/search?name=${encodedSearchQuery}`
  );

  const buttonSortHandler = (e: any) => {
    setSortBy(e.target.value.split(" ")[0]);
    setSortDir(e.target.value.split(" ")[1]);
  };

  const fetchCategories = async (url: string) => {
    const response = await fetch(url);
  
    if(!response.ok) throw new Error("Failed to fetch Categories for Navbar");
    
    return response.json();
  }

  const fetchProduct = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/product", {
        params: {
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      });
      setProducts(response.data);
      console.log("dari fetchProduct", response.data);
    } catch (error) {
      //console.log(error);
    }
  };

  const {data: categoryData, isLoading: categoryDataIsLoading} = useSWR<{categories: Array<Category>}>(
    `http://localhost:3000/api/category/`, 
    fetchCategories
  );

  const onFilter  = (categoryId: number) =>{
    const encodedSearchQuery = encodeURI(categoryId.toString());
    router.push(`http://localhost:3000/filter?q=${encodedSearchQuery}`);
    //console.log(encodedSearchQuery);
  }
  

  const routeToProduct = (productId: number) => {
    router.push({
      pathname: "/product/detail/",
      query: {id: String(productId)}
    });
  }

  const handleNodemailer = (e: any) => {
    e.preventDefault();
    console.log("Sending");

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
      console.log("Response received");
      if (res.status === 200) {
        console.log("Response succeeded!");
        setSubmitted(true);
      }
    });
  };

  useEffect(() => {
    fetchProduct();
  }, [sortDir, sortBy]);

  // console.log("sortDirHandler", sortDir);
  // console.log("sortByHandler", sortBy);
  console.log('data yang kesimpen', useSession().data?.user)
  console.log('data yang kesimpen2', session?.user.email!)

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <Navbar />
      <div id="content" className="p-2 space-y-4">
        <div id="category-list" className=" carousel carousel-center p-4 h-28 space-x-1 items-center shadow rounded-md lg:hidden">
          {
            categoryDataIsLoading 
            ? null 
            : categoryData?.categories.map((category) => <CategoryListItem category={category} onClick={onFilter} key={category.id.valueOf()}/>)
          }
        </div>
        <div id="product-carousel-container" className="relative flex justify-center">
          <div id="product-carousel" className="carousel w-full rounded-lg lg:w-3/4 lg:h-96">
            <div id="slide1" className="carousel-item relative w-full transition duration-700 ease-in-out hover:cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide2" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full hover:cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1680500055774-7185391be33d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide3" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full hover:cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1680371371611-9168e2d7bfcd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2146&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide4" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full hover:cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1679678691010-894374986c54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1198&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide1" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
          </div>
          <div id='slide-button-group-container' className=" absolute w-full bottom-0 left-0">
            <div className="flex justify-center w-full py-2 gap-2">
              <a href="#slide1" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a> 
              <a href="#slide2" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a> 
              <a href="#slide3" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a> 
              <a href="#slide4" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a>
            </div>
          </div>
        </div>
        <div id="product-list-container" className="flex justify-center">  
          <div id="product-list" className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:w-3/4">
            {products.map((product) => <ProductCard onClick={() => routeToProduct(product.id)} product={product} key={product.id}/>)}
          </div>
        </div>
      </div>
    </>
  );
}
