import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { prisma } from "../../lib/prisma";
import { getSession } from "next-auth/react";
import Navbar from "../navbar";
import Head from "next/head";
import { useEffect, useState } from "react";
import ShopDetailCard from "@/pages/components/shop_detail_card";
import { Shop, User } from "@prisma/client";

interface FetchData {
  product: {
    id: Number;
    name: string;
    price: Number;
    stock: Number;
    category: Category;
    description: string;
    image: string;
    averageRating: number;
    shop: Shop;
  };
  ratings: {
    id: Number;
    rate: Number;
    comment: string;
    image: string;
    productInCart: ProductInCart;
  }[];
}

interface ProductInCart{
  cart: Cart;
}

interface Cart{
  user: User;
}

interface Category {
  id: Number;
  category: string;
}

interface CartData {
  productId: Number;
  count: Number;
  productCount: Number;
  isCheckout: boolean;
}

export default function CreateShop({ product, ratings }: FetchData) {
  const [count, setCount] = useState(1);
  const [index, setIndex] = useState(0);
  const [Subtotal, setSubtotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image.split(",")[0]);
  const router = useRouter();
  const { id } = router.query;

  console.log("client side: ", ratings);

  const handleCount = () => {
    let newSubtotal = product.price.valueOf() * count;
    console.log("New subtotal: " + newSubtotal.toString());
    setSubtotal(newSubtotal);
  };

  async function addToCart(count: number) {
    const data: CartData = {
      productId: product.id,
      count: Number(count),
      productCount: Number(product.stock) - Number(count),
      isCheckout: false
    };
    try {
      fetch("http://localhost:3000/api/cart/add", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => router.back());
    } catch (error) {
      //console.log(error)
    }
  }

  async function checkout(count: number) {
    const data: CartData = {
      productId: product.id,
      count: Number(count),
      productCount: Number(product.stock) - Number(count),
      isCheckout: true
    };
    try {
      fetch("http://localhost:3000/api/cart/add", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => router.push("http://localhost:3000/transactions"));
    } catch (error) {
      //console.log(error)
    }
  }

  function onImageClick(i: number){
    let images = product.image.split(",");
    setSelectedImage(images[i]);
    setIndex(i)
  }

  useEffect(() => {
    handleCount();
  }, [count]);

  return (
    <div>
      <Head>
        <title>{product.name} | Store.ant</title>
      </Head>
      <Navbar />
      <div className="sm:flex sm:flex-row">
        <section
          id="product-information-panel"
          className="mb-10 sm:mb-0 w-full lg:w-2/3"
        >
          <div id="product-image-container" className="p-4 w-full h-auto">
            <div className="w-full h-auto">
              <img
                src={`http://localhost:3000/${selectedImage}`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
                }}
                alt=""
                className="mx-auto my-auto h-auto"
              />           
              <div className="absolute flex w-fit mx-10 transform -translate-y-1/4 left-5 right-5 top-1/2">
                <button disabled={index === 0 ? true : false} onClick={()=> onImageClick(index - 1)} className="btn btn-circle btn-sm lg:btn-md">❮</button>
                <button disabled={index === product.image.split(",").length - 1 ? true : false} onClick={()=> onImageClick(index + 1)} className="btn btn-circle btn-sm lg:btn-md">❯</button>
              </div>
            </div>
            <div className="flex h-40 mt-5 gap-x-5">
              {product.image.split(",").map((image, i)=>(
                <img
                  key = {i}
                  src={`http://localhost:3000/${image}`}
                  onClick={()=>{onImageClick(i)}}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                      "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
                  }}
                  alt=""
                  className="mx-auto my-auto w-1/4 h-full"
                />
              ))}
            </div>
          </div>
          <div
            id="product-title-container"
            className="p-4 flex flex-row items-center border-b-gray-300 border-b-2"
          >
            <h1 className="text-4xl w-1/2">{product.name}</h1>
            <div
              id="actions"
              className="flex flex-row w-1/2 justify-end space-x-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>
          <div
            id="category-and-description"
            className="p-4 border-b-gray-300 border-b-2"
          >
            <div className="flex flex-row space-x-2 mb-2">
              <h1>{product.category.category}</h1>
              <h1 className="text-gray-700">•</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 fill-yellow-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <h1>{Number.parseFloat(String(product.averageRating)).toFixed(2)}</h1>
            </div>
            <h1 className="text-2xl mb-2">Description</h1>
            <p className="text-justify">
              {product.description}
            </p>
            {/* <p className="text-justify">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
              quia doloribus est atque consequuntur in aut, cupiditate, iste
              velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati
              possimus sapiente, eos mollitia doloremque.
            </p>
            <p className="text-justify">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
              quia doloribus est atque consequuntur in aut, cupiditate, iste
              velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati
              possimus sapiente, eos mollitia doloremque.
            </p> */}
          </div>
          <div id="store-details" className="p-4 border-b-gray-300 border-b-2">
            <ShopDetailCard shop={product.shop} />
          </div>
          <div id="reviews" className="p-4 border-b-gray-300 border-b-2">
            <h1 className="text-2xl mb-2">Reviews</h1>
            {ratings?.length !== 0 ? (
              <div>
                {ratings?.map((rating) => (
                  <div
                    className="card bg-base-100 shadow-xl text-md"
                    key={String(rating.id)}
                  >
                      <div className="flex">
                        <div id='rating-profile-picture-container' className='mx-5 w-1/3 flex sm:w-auto'>
                        {rating.productInCart.cart.user.image ? (
                            <img
                              className='mt-5 object-cover rounded-full w-16 h-16 sm:h-16 border-2 border-gray-600'
                              src={`${rating.productInCart.cart.user.image}`}                              
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src =
                                "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                              }}
                            />
                        ) : (
                            <img 
                              className='mt-5 object-cover rounded-full w-16 h-16 sm:h-16 border-2 border-gray-600'
                              src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" 
                            />
                        )}
                      </div>
                      <div className="w-full">
                        <div className="py-5 flex w-full">
                          <div>
                            <h2 className="card-title">
                              {rating.productInCart.cart.user?.name}
                            </h2>
                            <p>{String(rating.rate)}/5</p>
                            <p>{rating.comment}</p>
                            {rating.image ? (
                                <div className="flex gap-x-2">
                                  {rating.image.split(",").map((image) => (
                                    <img
                                      className='object-cover w-64 h-auto border-2 border-gray-600'
                                      src={`http:\\\\localhost:3000\\\\${image}`}                              
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src =
                                        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                                      }}
                                    />
                                  ))}
                                </div>
                            ) : (
                                <img 
                                  hidden={true}
                                  className='object-cover w-64 h-64 sm:h-16 border-2 border-gray-600'
                                  src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" 
                                />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No ratings yet</p>
            )}
          </div>
        </section>
        <section
          id="item-order-section"
          className="hidden lg:block sm:w-1/3 p-2"
        >
          <div className="p-4 shadow-lg rounded-lg sticky top-2">
            <h1>Stok {renderStockCount(product.stock)}</h1>
            <h1 className="text-4xl my-2">Rp.{product.price.toString()}</h1>
            <div className="custom-number-input h-10 w-32">
              <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                <button
                  onClick={() => setCount(count - 1)}
                  disabled={count == 1 ? true : false}
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
                  onClick={() => setCount(count + 1)}
                  disabled={count == product.stock ? true : false}
                  className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <h1>Subtotal: Rp.{Subtotal}</h1>
            <div id="button-group" className="mt-4 w-auto space-x-4">
              <button
                onClick={() => checkout(1)}
                disabled={count === 0 ? true : false}
                className="w-20 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent"
              >
                Beli
              </button>
              <button
                onClick={() => addToCart(count)}
                disabled={count === 0 ? true : false}
                className="w-32 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
        <div id='mobile-item-order-section' className='lg:hidden fixed bottom-0 left-0 bg-blue-gray-300 flex flex-row p-2 h-18 w-screen align-middle justify-center'>
            <section id='price-section' className='w-1/2 flex flex-row justify-center'>
              {/* <div id='text-container' className='h-10 w-auto p-1 flex items-center justify-center text-white'>
                <h1>Price: Rp.{product.price.toString()}</h1>
              </div> */}
              <button className='h-10 w-40 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Placeholder Button
              </button>
            </section>
            <section id='button-actions-section' className='w-1/2 space-x-2 flex flex-row justify-center'>
              <button onClick={() => checkout(1)} className='h-10 w-20 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Beli
              </button>
              <button onClick={()=> addToCart(1)} className='h-10 w-24 p-1 rounded-md bg-green-800 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                Add to cart
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

const renderStockCount = (stockNumber: Number) => {
  if (stockNumber.valueOf() > 0) {
    return <span className="text-cyan-600">{stockNumber.toString()}</span>;
  } else {
    return <span className="text-red-500">{stockNumber.toString()}</span>;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const product = await prisma.product.findFirst({
    where: { id: Number(context.query.id) },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: true,
      description: true,
      image: true,
      averageRating: true,
      shop: true
    },
  });

  console.log("product: ", product);
  const ratings = await prisma.rating.findMany({
    where: {
      productInCart: {
        productId: product?.id,
      },
    },
    select: {
      id: true,
      rate: true,
      comment: true,
      image: true,
      productInCart: {
        select: {
          cart: {
            select: {
              user: true,
            },
          },
        },
      },
    },
  });
  console.log("server side: ", ratings);
  return {
    props: {
      product,
      ratings,
    },
  };
};
