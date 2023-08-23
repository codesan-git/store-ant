import React from 'react'
import Head from 'next/head';
import Navbar from './navbar';
import Footer from './footer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Address, Product, Profile, Shop, User, Category } from "@prisma/client";
import useSWR from 'swr';
import ProductCard from '@/components/index/product_card';
import ProductItem from '@/components/shop/product_item';
import { GetServerSideProps } from 'next';
import { prisma } from "../lib/prisma";


const fetchProducts = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("failed");
  }

  return response.json();
}

interface Props {
  products: (Product &
  {
    shop: Shop
    & {
      user: User
      & {
        profile: Profile
        & {
          addresses: Address[]
        }
      }
    },
    category: Category
  })[],
  events: Event[];
}

const Search = ({ products }: Props) => {
  const search = useSearchParams();
  const searchQuery = search.get('q');
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const { data, isLoading } = useSWR<{ products: Array<Product> }>(
    `/api/product/search?q=${encodedSearchQuery}`,
    fetchProducts
  )

  if (!data?.products) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Search</title>
      </Head>
      <Navbar />

      {/* Content */}
      <div className="w-3/4 mx-auto">
        <div className="px-8 my-8 flex-col grid lg:grid-cols-4 gap-10">
          {
            products.map((product, i) => <ProductCard product={product} key={i}/>)
          }
        </div>
      </div>
      {/* End Content */}
      <Footer />
    </div>
  )
}

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {

  const searchedString = context.query.q;

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchedString as string,
            mode: 'insensitive'
          }
        },
        {
          shop: {
            shopName: {
              contains: searchedString as string,
              mode: 'insensitive'
            }
          }
        }
      ],
      stock: { not: 0 }
    },
    orderBy: {
      id: 'desc'
    },
    include: {
      category: true,
      shop: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: {
                include: {
                  addresses: {
                    select: {
                      city: true
                    },
                    where: {
                      isShopAddress: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return {
    props: {
      products: products
    },
  };
}

