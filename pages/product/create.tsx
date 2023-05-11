import React from 'react'
import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr';
import { Category } from '@prisma/client';
import axios from 'axios';

const fetchProducts = async(url: string) => {
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("failed");
    }
    
    return response.json();
}

interface FormData{
    name: string,
    price: string,
    stock: string,
    description: string,
    categoryId: string
}

export default function CreateProduct() {
  const [form, setForm] = useState<FormData>({name: '', price: '', stock:'', description: '', categoryId: '1'});
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const {data, isLoading} = useSWR<{categories : Array<Category>}>(
    `/api/category/`,
    fetchProducts
  )

  if(!data?.categories){
    return null;
  }
  
  const handleUpload = async () => {
    try {
        if(!selectedFile) return;
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("description", form.description);
        formData.append("categoryId", form.categoryId);
        await axios.post('http://localhost:3000/api/product/create', formData).then(() => {router.back() });
    } catch (error: any) {
        //console.log(error);
    }
  }

  return (
    <div>
      <h1 className='text-2xl text-gray-800 font-bold'>Add Product</h1>
      <form action="">
        <section>
          <div className='border-gray-600 border border-dashed flex justify-center items-center h-40 relative'>
            <input type="file" accept='.jpg, .jpeg .png, .svg .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
              onChange={({target}) => {
                if(target.files){
                    const file = target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                }
            }}
            />
            <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-row'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              &nbsp;Select Image
            </label>
          </div>
        </section>
        <section  className='space-y-4 p-2 flex flex-col'>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="product-name-input">Name</label>
            <input  id='product-name-input' name='product-name' type="text" className='border border-black focus:border-none' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="">Category</label>
            <select name="product-category" id="product-category-input" className='h-8 p-2'>
              <option value="">Makanan</option>
              <option value="">Waifu</option>
              <option value="">Pasokon</option>
            </select>
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="product-quantity-input">Quantity</label>
            <input id='product-quantity-input' name='product-quantity' type="number" className='border border-black focus:border-none'/>
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="product-price-input">Price</label>
            <input id='product-price-input' name='product-price' type="number" className='border border-black focus:border-none'/>
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="">Description</label>
            <textarea name="product-description" id="product-description-input" className='h-36 border border-black focus:border-none'/>
          </div>
          <button className='btn fill-indigo-700'>
            Submit
          </button>
        </section>
      </form>
    </div>
  )
}
