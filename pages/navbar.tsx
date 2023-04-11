import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HiShoppingCart } from "react-icons/hi";
import { useState } from 'react';

async function handleGoogleSignOut() {
    signOut({ callbackUrl: "http://localhost:3000/login" });
  }

// export default function 
const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
    
  const [query, setQuery] = useState('');
  const onSearch = (event : React.FormEvent) => {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(query);
    router.push(`/search?q=${encodedSearchQuery}`);
    //console.log(encodedSearchQuery);
  }

  return (
    <>
      {/* New Navbar */}
      <div className="navbar bg-base-100 px-32 shadow">
        <div className="navbar-start">
          <div className="flex-1 lg:mx-16">
            <a className="btn btn-ghost normal-case text-xl text-primary-focus" href="/">
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
          <form onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Shop now"
              className="input input-bordered input-primary input-sm w-full placeholder-primary-focus"
              value={query}
              onChange={e => {setQuery(e.target.value); }}
            />
          </form>
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
    </>
  );
}

export default Navbar