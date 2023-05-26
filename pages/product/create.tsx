import React from 'react'
import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr';
import { Category } from '@prisma/client';
import axios from 'axios';
import { HiOutlineCamera, HiOutlinePhoto } from 'react-icons/hi2';

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
  const [selectedFiles, setFile] = useState<any[]>([]);

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
        setFile([...selectedFiles, file[i]]);
      } else {
        console.log("only images accepted");
      }
      console.log("FILES: ", selectedFiles);
    }
  };
  
  const removeImage = (i: string) => {
    setFile(selectedFiles.filter((x) => x.name !== i));
    if(selectedFiles.length >= 2)
      setSelectedImage(URL.createObjectURL(selectedFiles[selectedFiles.length - 2]));
  };
  
  const handleUpload = async () => {
    try {
        if(selectedFiles.length == 0) return;
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("image", file) );
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

  const renderInputMessage = () => {

    if(selectedFiles.length >= 5) return (
      <>
        <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
          <HiOutlinePhoto className='w-6 h-6'/>
          <p className='text-xs lg:text-base'>&nbsp;You have reached the max limit for photos.</p>
        </label>          
      </>
    );
    
    return (
      <>
        <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
          <HiOutlineCamera className='w-6 h-6'/>
          &nbsp;Select Image
        </label>
      </>
    );
  }

  const renderSelectedImages = () => {
    if(selectedFiles.length == 0) return;

    return (
      <>
        <div className='flex flex-row gap-2'>
          {
            selectedFiles.map( 
              (file, key) => 
                <div key={key} className="relative">
                  <div onClick={() => removeImage(file.name)} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer">
                    ✕
                  </div>
                  <img src={URL.createObjectURL(file)} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" />
                </div>
            )
          }
        </div>
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
        <section className='px-4 lg:w-1/2 flex flex-col justify-center items-center space-y-4'>
          <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-40 w-full lg:h-5/6 lg:w-5/6 relative'>
            <input disabled={selectedFiles.length >= 5} type="file" accept='.jpg, .jpeg, .png, .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
              onChange={({target}) => {
                handleFile(target); 
                if(target.files){
                  const file = target.files[0];
                  if(file)
                    setSelectedImage(URL.createObjectURL(file));
                }
              }}
            />
            {renderInputMessage()}
          </div>
          {renderSelectedImages()}
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
