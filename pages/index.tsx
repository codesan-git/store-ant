import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { HiShoppingCart } from "react-icons/hi";
import { RxDotFilled } from 'react-icons/rx';
import Navbar from "./navbar";
import Footer from "./footer";

async function handleGoogleSignOut() {
  signOut({ callbackUrl: "http://localhost:3000/login" });
}

interface Products {
  products: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
}

export default function Home({ products }: Products) {
  const { data: session } = useSession();
  const router = useRouter();

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
              <a
                href="#slide4"
                className="btn btn-circle"
              >
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
              <a href="#slide1" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700 ease-in-out"><RxDotFilled /></a>
              <a href="#slide2" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a>
              <a href="#slide3" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a>
              <a href="#slide4" className="text-2xl cursor-pointer text-slate-200 hover:bg-slate-50 hover:rounded-full hover:text-slate-700 active:text-slate-700"><RxDotFilled /></a>
            </div>
          </div>
        </div>
        {/* End Carousel */}
        <div className="px-8 my-8 flex-col grid lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              data-theme="garden"
              className="card w-auto glass"
              key={product.id}
              onClick={() => router.push({pathname: '/product/detail/', query: { id: String(product.id) }})}
            >
              <figure>
                <img
                  src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                  alt="image!"
                />
              </figure>
              <div className="card-body py-5 h-1/4">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-md">Rp. {product.price}</p>
                <p className="text-md">Qty. {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End Content */}
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
    orderBy: [
      {
        id: "asc",
      },
    ],
  });
  return {
    props: {
      products,
    },
  };
};

// update Apr 3 -2

// type Data = { }

// export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (context) => {
//   const session = await getSession({context?.req})

//   return {
//     props: {
//       data,
//     },
//   }
// }

// function Guest(){
//   return(
//     <main className='container mx-auto text-center py-20'>
//       <h3 className='text-4xl font-bold'>
//         Guest Homepage
//       </h3>
//       <div className='flex justify-center'>
//         <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/login'}>Sign In</Link>
//       </div>
//     </main>
//   )
// }

// function User({user}: {user : DefaultSession["user"]}){
//   return(
//     <main className='container mx-auto text-center py-20'>
//       <h3 className='text-4xl font-bold'>
//         User Homepage
//       </h3>
//       <div className='details'>
//         <h5>{user?.name}</h5>
//         <h5>{user?.email}</h5>
//       </div>
//       <div className="flex justify-center">
//         <button className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 bg-gray-50'>Sign Out</button>
//       </div>
//       <div className='flex justify-center'>
//         <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/profile'}>profile</Link>
//       </div>
//     </main>
//   )
// }
