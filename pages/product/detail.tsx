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
        <Navbar/>
        <div className="my-5 mx-2">
            <div>
                <h1>Product Detail</h1>
            </div>
            <div id='content' className="flex flex-row ">
                <section className='w-2/3 p-4 bg-yellow-600'>
                    <div id='product-details' className="flex flex-row space-x-10">
                        <div id='product-image-container' className="bg-deep-orange-400 w-72 h-72 py-14">
                            <img className='object-fill'
                                src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" 
                                alt=''
                            />
                        </div>
                        <div id='product-name-and-price' className='mt-4'>
                            <h1 className='text-4xl'>{product.name}</h1>
                            <div className='flex flex-row space-x-4'>
                                <h1>Category: {product.category.category}</h1>
                                <h1>Qty: {product.stock.toString()}</h1>
                            </div>
                            <h1>Price: Rp.{product.price.toString()}</h1>
                        </div>
                    </div>
                    <div className='my-4 w-100'>
                        <h1 className='text'>Description</h1>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                    </div>
                    <div id='button-group' className='mt-4 w-auto space-x-4'>
                        <button className='w-24 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                            Beli
                        </button>
                        <button className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                            Add to Cart
                        </button>
                    </div>
                </section>
                <section className='w-1/3 p-4 bg-blue-gray-600'>
                    <h1>store details</h1>
                </section>
            </div>
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
