import styles from "../../styles/Form.module.css";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import Navbar from "../navbar";
import { useState } from "react";
import axios from "axios";

interface FetchData {
  product: {
    id: Number;
    name: string;
    price: Number;
    stock: Number;
    category: Category;
    image: string;
  };
}

interface Category {
  id: Number;
  category: string;
}

interface CartData{
    productId: Number;
    count: Number
}

export default function CreateShop({ product }: FetchData) {
  const [count, setCount] = useState(0);
  const router = useRouter();
  //   const {id} = router.query;

  async function create() {
    const data : CartData = {productId: product.id, count: count};
    try{
        fetch('http://localhost:3000/api/cart/add', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> router.back())
    }catch(error){
        console.log(error)
    }
  }

  return (
    <div>
      <Navbar />
      <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
          <div className="title">
            <h1 className="text-gray-800 text-4xl font-bold py-4">
              Product Detail
            </h1>
          </div>

          <div>
            <figure>
              {product.image ? (
                <img src={`http://localhost:3000/${product.image}`} />
              ) : (
                <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
              )}
            </figure>
            <p>{product.name}</p>
            <p>{product.category.category}</p>
            <p>{String(product.price)}</p>
            <p>{String(product.stock)}</p>
          </div>
          <div className="custom-number-input h-10 w-32 -mt-10">
            <label className="custom-input-number w-full text-gray-700 text-sm font-semibold">
              Counter Input
            </label>
            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
              <button
                onClick={()=>setCount(count - 1)}
                disabled={count == 0? true : false}
                className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
              >
                <span className="m-auto text-2xl font-thin">−</span>
              </button>
              <input
                type="text"
                inputMode="numeric"
                className="mx-auto outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md pointer-events-none md:text-basecursor-default flex items-center text-gray-700 "
                name="custom-input-number"
                value={String(count)}
              ></input>
              <button
                onClick={()=>setCount(count + 1)}              
                disabled={count == product.stock? true : false}
                className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
              >
                <span className="m-auto text-2xl font-thin">+</span>
              </button>
            </div>
            <button onClick={()=> create()} disabled={count === 0? true : false} className="w-32 btn btn-primary mt-5">Add to Cart</button>
        </div>
        </section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const product = await prisma.product.findFirst({
    where: { id: Number(context.query.id) },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: true,
      image: true,
    },
  });
  return {
    props: {
      product,
    },
  };
};
