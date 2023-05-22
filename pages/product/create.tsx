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
  const [selectedImage, setSelectedImage] = useState<string>();
  const [files, setFile] = useState<any[]>([]);

  const {data, isLoading} = useSWR<{categories : Array<Category>}>(
    `/api/category/`,
    fetchProducts
  )

  if(!data?.categories){
    return null;
  }

  // Peter TODO: Review form submit code
  // Bila: hehe

  function handleFile(target: any){
    let file = target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFile([...files, file[i]]);
      } else {
        console.log("only images accepted");
      }
      console.log("FILES: ", files);
    }
  };
  
  const removeImage = (i: string) => {
    setFile(files.filter((x) => x.name !== i));
    if(files.length >= 2)
      setSelectedImage(URL.createObjectURL(files[files.length - 2]));
  };
  
  const handleUpload = async () => {
    try {
        if(files.length == 0) return;
        const formData = new FormData();
        files.forEach((file) => formData.append("image", file) );
        //formData.append("image", selectedFile);
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

  const renderSelectedImage = () => {

    if(selectedImage) return <img src={selectedImage} alt="Unable to display selected image" className='w-full h-1/2 object-cover'/>;
    
    return (
      <>
        <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-row'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          &nbsp;Select Image
        </label>
      </>
    );
  }

  return (
    <div className='lg:px-36'>
      <div id='title-hack-container' className=''>
        <section className='pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center'>
          <div className='lg:w-5/6 justify-start'>
            <h1 className=' text-2xl  font-bold mb-2 font-bold'>Add Product</h1>
          </div>
        </section>
      </div>
      <form action="" onSubmit={e=>{e.preventDefault(); handleUpload();}} className='lg:flex lg:flex-row'>
        <section className='px-4 lg:w-1/2 flex lg:flex-col justify-center items-center'>
          <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-40 w-full lg:h-5/6 lg:w-5/6 relative'>
            <input type="file" accept='.jpg, .jpeg, .png, .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
              onChange={({target}) => {
                handleFile(target); 
                if(target.files){
                  const file = target.files[0];
                  if(file)
                    setSelectedImage(URL.createObjectURL(file));
                }
              }}
            />
            {renderSelectedImage()}
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {files.map((file, key) => {
                return (
                  <div key={key} className="relative overflow-hidden">
                    <div
                      onClick={() => {
                        removeImage(file.name);
                      }}
                      className="right-1 hover:text-white cursor-pointer bg-red-400"
                    >Remove</div>
                    <img
                      className="h-20 w-20 rounded-md"
                      src={URL.createObjectURL(file)}
                    />
                  </div>
                );
              })}
          </div>
        </section>
        <section  className='p-4 lg:w-1/2'>
          <div className=' space-y-4 flex flex-col'>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="product-name-input" className='font-bold'>Name</label>
              <input  id='product-name-input' name='product-name' type="text" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="product-category-input" className='font-bold'>Category</label>
              <select name="product-category" id="product-category-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                onChange={e => {e.preventDefault(); setForm({...form, categoryId: e.target.value})}} 
              >
                {data.categories.map(category =>(
                        <option value={category.id} key={category.id}>{category.category}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="product-quantity-input" className='font-bold'>Quantity</label>
              <input id='product-quantity-input' name='product-quantity' type="number" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.stock} onChange={e => setForm({...form, stock: e.target.value})}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="product-price-input" className='font-bold'>Price</label>
              <input id='product-price-input' name='product-price' type="number" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.price} onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="" className='font-bold'>Description</label>
              <textarea name="product-description" id="product-description-input" className='p-2 h-48 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.description} onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>
            <button className='h-10 lg:w-36 rounded text-white bg-indigo-700'>
              Submit
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
