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
      <h1 className='text-2xl'>Add Product</h1>
      <form action="">
        <section>

        </section>
        <section  className='space-y-4 p-2 flex flex-col'>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="product-name-input">Name</label>
            <input  id='product-name-input' name='product-name' type="text" className='border border-black focus:border-none' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label htmlFor="">Description</label>
            <textarea name="product-description" id="product-description-input" className='h-36 border border-black focus:border-none'/>
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
            <label htmlFor="">Category</label>
            <select name="product-category" id="product-category-input" className='h-8 p-2'>
              <option value="">Makanan</option>
              <option value="">Waifu</option>
              <option value="">Pasokon</option>
            </select>
          </div>
        </section>
      </form>
    </div>
  )
}
