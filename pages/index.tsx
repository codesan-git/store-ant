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
import ProductCard from "@/components/index/product_card";
import styles from "../styles/Home.module.css";

// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
import { useState, Dispatch, useEffect } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import CategoryListItem from "@/components/index/category_list_item";

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
    averageRating: number
  }[];
}


interface Sort {
  _sort: string;
}
interface Order {
  name: string;
}

interface EventData {
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

export default function Home({ events }: EventData) {
  const { data: session } = useSession();
  const [sortSort, setSortSort] = useState<Sort>({ _sort: "id" });
  // const [sortOrder, setSortOrder] = useState<Order>({ _order: "desc" });
  const [sortDir, setSortDir] = useState("desc");
  const [sortBy, setSortBy] = useState("id");
  const [products, setProducts] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(events[0]?.image);

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
      if (res.status === 200) {
        setSubmitted(true);
      }
    });
  };

  useEffect(() => {
    fetchProduct();
  }, [sortDir, sortBy]);

  function navigateCarousel(i: number){
    console.log("CLICK, INDEX: ", i);
    if(i >= events.length)
      i = 0;
    if(i < 0)
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
                  src={selectedImage}
                  className="w-full object-cover"
                  onClick={() => window.open(events[index]?.eventPath)}                                        
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                    "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                  }}
                />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <button onClick={()=> navigateCarousel(index - 1)} className="btn btn-circle btn-sm lg:btn-md">❮</button>
                  <button onClick={()=> navigateCarousel(index + 1)} className="btn btn-circle btn-sm lg:btn-md">❯</button>
                </div>
              </div>
          </div>
          <div id='slide-button-group-container' className=" absolute w-full bottom-0 left-0">
            <div className="flex justify-center w-full py-2 gap-2">
              {events.map((eventData, i) => (
                <button key={i} onClick={()=> navigateCarousel(i)} className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></button> 
              ))}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};