import React from 'react'
import Head from 'next/head';
import Navbar from './navbar';
import Footer from './footer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Product } from '@prisma/client';
import useSWR from 'swr';
import ProductCard from '@/components/product_card';

const fetchProducts = async(url: string) => {
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("failed");
    }
    
    return response.json();
}

export default function Search() {
  const search = useSearchParams();
  const searchQuery = search.get('q');
  const encodedSearchQuery = encodeURI(searchQuery!);
  const router = useRouter();

  const {data, isLoading} = useSWR<{products : Array<Product>}>(
    `/api/product/filter?q=${encodedSearchQuery}`,
    fetchProducts
  )

  if(!data?.products){
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
          {data!.products.map((product) => (
            <div
              data-theme="garden"
              className="card w-auto glass"
              key={product.id}
              onClick={() => router.push({pathname: '/product/detail/', query: { id: String(product.id) }})}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
      {/* End Content */}
      <Footer />
    </div>
  )
}
