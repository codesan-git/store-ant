import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
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

interface Category {
  id: Number;
  category: string;
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
      console.log(error);
    }
  };
  // console.log('items gan',items)
  const renderProducts = () => {
    return products.map((product) => {
      return (
        <div
          data-theme="garden"
          className="card w-auto glass"
          key={product.id}
          onClick={() =>
            router.push({
              pathname: "/product/detail/",
              query: { id: String(product.id) },
            })
          }
        >
          <ProductCard product={product} />
        </div>
      );
    });
  };

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
      <div id="content" className="w-auto p-2 space-y-2">
        <div id="category-list" className=" carousel carousel-center p-4 h-28 space-x-1 items-center shadow rounded-md">
          {/* Best way to style a category */}
          <div id="category-item" className="carousel-item flex-col items-center p-2 w-16 h-16">
            <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
              </svg>
            </div>
            <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
              <h1 className="text-xs text-center">Rumah Tangga</h1>
            </div>
          </div>
          
          <div id="category-item" className="carousel-item flex-col items-center p-2 w-16 h-16">
            <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                <path fillRule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
              <h1 className="text-xs text-center">Makanan</h1>
            </div>
          </div>
          <div id="category-item" className="carousel-item flex-col items-center p-2 w-16 h-16">
            <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                <path fillRule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
              <h1 className="text-xs text-center">Makanan</h1>
            </div>
          </div>
          <div id="category-item" className="carousel-item flex-col items-center p-2 w-16 h-16">
            <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                <path fillRule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
              <h1 className="text-xs text-center">Makanan</h1>
            </div>
          </div>
          <div id="category-item" className="carousel-item flex-col items-center p-2 w-16 h-16">
            <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                <path fillRule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
              <h1 className="text-xs text-center">Makanan</h1>
            </div>
          </div>
        </div>
        <div id="product-carousel-container" className="relative">
          <div id="product-carousel" className="carousel w-full">
            <div id="slide1" className="carousel-item relative w-full transition duration-700 ease-in-out">
              <img
                src="https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide2" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <img
                src="https://images.unsplash.com/photo-1680500055774-7185391be33d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide3" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <img
                src="https://images.unsplash.com/photo-1680371371611-9168e2d7bfcd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2146&q=80"
                className="w-full object-cover"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle btn-sm lg:btn-md">❮</a>
                <a href="#slide4" className="btn btn-circle btn-sm lg:btn-md">❯</a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
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
        <div id="product-list" className="grid grid-cols-2 gap-10">
          {renderProducts()}
        </div>
      </div>
    </>
  );
}
