import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { HiShoppingCart } from "react-icons/hi";

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

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      {/* New Navbar */}
      <div className="navbar bg-base-100 px-32 bg-lime-200">
        <div className="navbar-start">
          <div className="flex-1 lg:mx-16">
            <a className="btn btn-ghost normal-case text-xl text-primary-focus">
              Store{" "}
              <span className="text-indigo-700 to-secondary-focus">.</span>
              <span className="text-secondary-focus">ant</span>
            </a>
            {/* Dropdown */}
            <div className="dropdown dropdown-hover mr-4">
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
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
            {/* End Dropdown */}
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <input
            type="text"
            placeholder="Shop now"
            className="input input-bordered input-primary input-sm w-full"
          />
        </div>
        <div className="navbar-end">
          {/* Session Login */}
          {session ? (
            <div className="flex-none">
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
                    <span className="badge badge-sm indicator-item">8</span>
                  </div>
                </label>
                <div
                  tabIndex={0}
                  className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
                >
                  <div className="card-body">
                    <span className="font-bold text-lg">8 Items</span>
                    <span className="text-info">Subtotal: $999</span>
                    <div className="card-actions">
                      <button className="btn btn-primary btn-block">
                        View cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar mr-3"
                >
                  <div className="w-10 rounded-full">
                    <img src={session?.user?.image!} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link
                      className="justify-between"
                      href={{
                        pathname: "/profile",
                        query: { email: session.user?.email },
                      }}
                    >
                      Profile
                      {/* <span className="badge">New</span> */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/shop",
                        query: { email: session.user?.email },
                      }}
                    >
                      Store
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleGoogleSignOut}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Dropdown Chart */}
              <div className="dropdown dropdown-hover dropdown-left mx-5">
                <label tabIndex={0} className="btn btn-ghost m-1 text-lg">
                  <HiShoppingCart />
                </label>
                <div
                  tabIndex={0}
                  className="dropdown-content card card-compact w-96 p-2 shadow bg-primary text-primary-content glass"
                >
                  <figure>
                    <img className="p-16" src="/assets/food.png" alt="car!" />
                  </figure>
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
              <p className="text-primary-focus mx-5">|</p>
              <a
                className="btn btn-outline btn-primary text-md btn-sm text-gray-100 lg:mx-4"
                href="/login"
              >
                Daftar
              </a>
              <a
                className="btn btn-primary btn-sm text-md text-gray-100 lg:mx-4"
                href="/login"
              >
                Masuk
              </a>
            </>
          )}
          {/* End Session Login */}
        </div>
      </div>
      {/* End New Navbar */}

      {/* Content */}
      <div className="w-2/3 mx-auto">
        {/* Carousel */}
        <div className="carousel w-full h-96 my-8 rounded-lg">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1661956603025-8310b2e3036d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              className="w-full object-cover"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 -inset-x-5 top-1/2 z-auto">
              <a
                href="#slide4"
                className="btn btn-outline btn-accent btn-circle"
              >
                ❮
              </a>
              <a href="#slide2" className="btn btn-primary btn-circle">
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
          <div className="flex justify-center w-full py-2 gap-2 z-auto">
            <a href="#slide1" className="btn btn-xs">
              1
            </a>
            <a href="#slide2" className="btn btn-xs">
              2
            </a>
            <a href="#slide3" className="btn btn-xs">
              3
            </a>
            <a href="#slide4" className="btn btn-xs">
              4
            </a>
          </div>
        </div>
        {/* End Carousel */}
        <div className="px-8 my-8 flex-col grid lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              data-theme="garden"
              className="card w-auto glass"
              key={product.id}
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

      {/* Footer */}
      <footer className="py-10 px-96 bg-lime-200">
        <div className="footer mx-auto">
          <div className="grid-rows-2 w-1/2">
            <span className="footer-title">Store.ant</span>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
            <span className="footer-title">Beli</span>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </div>
          <div className="grid-rows-3">
            <span className="footer-title">Jual</span>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
            <span className="footer-title">Bantuan dan Panduan</span>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
            <span className="footer-title">Keamanan & Privasi</span>
            <div className="flex gap-2">
              <a href="#" className="link link-hover">
                Pokoknya
              </a>
              <a href="#" className="link link-hover">
                Dijamin
              </a>
              <a href="#" className="link link-hover">
                Aman
              </a>
            </div>
          </div>
          <div>
            <span className="footer-title">Ikuti Kami</span>
            <div className="grid grid-flow-col gap-4">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mx-auto">
            <figure>
              <img
                width="200"
                height="200"
                className="fill-current"
                src="/assets/player.png"
                alt="car!"
              />
            </figure>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </div>
        </div>
      </footer>
      {/* End Footer */}
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
