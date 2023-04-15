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
  const [products, setProducts] = useState([]);

  const search = useSearchParams();
  const searchQuery = search.get("_sort");
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const { data, isLoading } = useSWR<{ products: Array<Products> }>(
    `/api/product/search?name=${encodedSearchQuery}`
  );

  const buttonSortHandler = (e: any) => {
    setSortBy(e.target.value.split(' ')[0])
    setSortDir(e.target.value.split(' ')[1]);
  };

  const fetchProduct = async() => {
    try {
      const response = await axios.get('http://localhost:3000/api/product',{
        params: {
          _sortBy: sortBy,
          _sortDir: sortDir
        }
      })
      setProducts(response.data)
      console.log('dari fetchProduct',response.data)
    } catch (error) {
      console.log(error)
    }
  }
  // console.log('items gan',items)
  const renderProduct = () => {
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
          {/* <>
            <figure>
              {value.image ? (
                <img src={value.image} />
              ) : (
                <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
              )}
            </figure>
            <div className="card-body py-5 h-1/4">
              <h2 className="card-title">{value.name}</h2>
              <p className="text-md">{value.category?.category}</p>
              <p className="text-md">Rp. {value.price}</p>
              <p className="text-md">Qty. {value.stock}</p>
            </div>
            {onEdit && onDelete ? (
              <div className="card-actions justify-end my-2">
                <button
                  onClick={() => onEdit(value.id.toString())}
                  className="w-16 btn btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(value.id.toString())}
                  className="w-16 btn bg-red-500"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </> */}
        </div>
      );
    });
  };

  useEffect(() => {
    fetchProduct();
  }, [sortDir, sortBy]);

  // const sort_by = (name, reverse, primer) => {

  //   const key = primer ?
  //     function(x) {
  //       return primer(x[field])
  //     } :
  //     function(x) {
  //       return x[field]
  //     };

  //   reverse = !reverse ? 1 : -1;

  //   return function(a, b) {
  //     return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  //   }
  // }

  // const sort_by = (field, reverse, primer) => {

  //   const key = primer ?
  //     function(x) {
  //       return primer(x[field])
  //     } :
  //     function(x) {
  //       return x[field]
  //     };

  //   reverse = !reverse ? 1 : -1;

  //   return function(a, b) {
  //     return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  //   }
  // }

  // if (products) {
  //   console.log("objectnya", JSON.parse(JSON.stringify(products)));
  // }
  console.log("sortDirHandler", sortDir);
  console.log("sortByHandler", sortBy);

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <Navbar />

      {/* Content */}
      <div className="w-3/4 mx-auto">
        {/* Test Carousel */}

        {/* End Test Carousel */}
        {/* Carousel */}

        <div className="carousel w-full h-96 my-8 rounded-lg">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              className="w-full object-cover"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide4" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide2" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1680500055774-7185391be33d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
              className="w-full object-cover"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide1" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide3" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1680371371611-9168e2d7bfcd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2146&q=80"
              className="w-full object-cover"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide2" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide4" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1679678691010-894374986c54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1198&q=80"
              className="w-full object-cover"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide3" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide1" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div className="absolute bottom-1/2 left-3/4">
            <div className="flex justify-center w-full gap-2 z-auto">
              <a
                href="#slide1"
                className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700 ease-in-out"
              >
                <RxDotFilled />
              </a>
              <a
                href="#slide2"
                className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"
              >
                <RxDotFilled />
              </a>
              <a
                href="#slide3"
                className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"
              >
                <RxDotFilled />
              </a>
              <a
                href="#slide4"
                className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"
              >
                <RxDotFilled />
              </a>
            </div>
          </div>
        </div>
        {/* End Carousel */}
        <select
          className="select select-bordered w-full max-w-xs"
          onClick={buttonSortHandler}
        >
          <option disabled selected>
            Sort Items
          </option>
          <option value="name asc">A-Z</option>
          <option value="name desc">Z-A</option>
          <option value="price asc">Harga Terendah</option>
          <option value="price desc">Harga Tertinggi</option>
        </select>
        <div className="px-8 my-8 flex-col grid lg:grid-cols-4 gap-10 cursor-pointer">
          {/* {products.map((product) => (
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
          ))} */}
          {renderProduct()}
        </div>
        <p>test content</p>
        {/* {getProduct()} */}
      </div>
      {/* End Content */}
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const req = context.req;
  const res = context.res;
  // const products = await prisma.product.findMany({
  //   select: {
  //     id: true,
  //     name: true,
  //     price: true,
  //     stock: true,
  //     category: true,
  //     image: true,
  //   },
  //   orderBy: [
  //     {
  //       id: "asc",
  //     },
  //   ],
  // });
  // return {
  //   props: {
  //     products,
  //   },
  // };

  const { _page, _limit, _sort, _order } = context.query;
  const sort = (_sort ?? "id").toString();
  const order = _order ?? "desc";

  const orderBy = { [sort]: order };

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: {
      products,
    },
  };
};
