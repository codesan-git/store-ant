import React from 'react'
import Head from 'next/head';
import Navbar from './navbar';
import Footer from './footer';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Address, Product, Profile, Shop, User, Category } from "@prisma/client";
import useSWR from 'swr';
import ProductCard from '@/components/index/product_card';
import { filter } from 'cypress/types/bluebird';
import { GetServerSideProps } from 'next';
import { prisma } from "../lib/prisma";
import ProductItem from '@/components/shop/product_item';

const fetchProducts = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("failed");
  }

  return response.json();
}

const fetchCategoryName = async (url: string) => {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("failed");

  }
  return response.json();
}

interface Props {
  searchedCategory: Category,
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

const Filter = ({ products, searchedCategory }: Props) => {
  const search = useSearchParams();
  const searchQuery = search.get('q');
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const { data: categoryData, isLoading: waitingForCategory } = useSWR<{ category: Category }>(
    `/api/category/${encodedSearchQuery}`,
    fetchCategoryName
  );

  //console.log(`Fetched Category data: ${categoryData?.category.category}`);

  return (
    <div>
      <Head>
        <title>Search</title>
      </Head>
      <Navbar />

      {/* Content */}
      <div className="w-3/4 mx-auto">
        <div id='breadcrumb' className='breadcrumbs my-8'>
          <ul>
            <li>
              <Link href={{
                pathname: '/'
              }}>Home</Link>
            </li>
            <li>{categoryData?.category.category}</li>
          </ul>
        </div>
        <div className="px-8 flex-col grid lg:grid-cols-4 gap-10">
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

export default Filter;

export const getServerSideProps: GetServerSideProps = async (context) => {

  const categoryId = context.query.q;

  const searchedCategory = await prisma.category.findFirst({
    where: {
      id: Number(categoryId)
    }
  });

  const products = await prisma.product.findMany({
    where: {
      categoryId: Number(categoryId)
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
      searchedCategory: searchedCategory,
      products: products
    },
  };
}
