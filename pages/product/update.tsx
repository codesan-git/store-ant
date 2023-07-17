import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link'
import { Category } from "@prisma/client";
import useSWR from 'swr';

const fetchCategories = async (url: string) => {

  const response = await fetch(url);

  if(!response.ok) throw new Error("Failed to fetch Categories for Navbar");

  return response.json();
}

interface FetchData{
    product:{
        id: Number,
        name: string,
        price: Number,
        stock: Number,
        category: CategoryModel,
        description: string,
        image: string
    }
}

interface CategoryModel{
    id: Number,
    category: string
}

interface FormData{
    name: string,
    price: string,
    stock: string,
    description: string,
    categoryId: string,
}

export default function CreateShop({product} : FetchData) {    
const [form, setForm] = useState<FormData>({name: product.name, price: String(product.price), stock: String(product.stock), description: product.description, categoryId: String(product.category.id)});
  const [selectedImage, setSelectedImage] = useState<string>();
  const [oldImages, setOldImages] = useState<string[]>(product.image.split(","));
  const [selectedFile, setSelectedFile] = useState<File>();
  const [files, setFile] = useState<any[]>([]);

  const productImages = product.image.split(",");
  const [images, setImages] = useState<string[]>(productImages);
  const router = useRouter();

  const {data, isLoading} = useSWR<{categories : Array<Category>}>(
    `/api/category/`,
    fetchCategories
  )
  if(!data?.categories){
    return null
  }

  function handleFile(target: any){
    let file = target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFile([...files, file[i]]);
        setImages([...images, URL.createObjectURL(file[i])])
      } else {
        console.log("only images accepted");
      }
      console.log("FILES: ", files);
      console.log("IMAGES: ", images);
    }
  };
  
  const removeImage = (i: string) => {
    setImages(images.filter((x) => x !== i));
    setOldImages(oldImages.filter((x) => x !== i));

    for (let i = 0; i < files.length; i++) {
        let tempFiles = files;
        if(images[i] === URL.createObjectURL(tempFiles[i])) {
          setFile([...files, tempFiles[i]]);
        }
        console.log("FILES: ", files);
    }

    //if(files.length >= 2)
    //  setSelectedImage(URL.createObjectURL(files[files.length - 2]));
  };

  const handleUpdate = async (id: string) => {
    try {
        if(files.length == 0 && oldImages.length == 0) return
        const formData = new FormData();
        files.forEach((file) => formData.append("image", file) );
        formData.append("imageString", oldImages.join(","));
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("categoryId", form.categoryId);
        await axios.put(`http://localhost:3000/api/product/${id}`, formData).then(() => { router.back() });
    } catch (error: any) {
        console.log(error.response);
    }
  }

  const handleSubmit = async(id: string) => {
    try{
        handleUpdate(id)
    }catch(error){
        //console.log(error)
    }
  }

  const renderSelectedImages = () => {
    if(images.length == 0) return;

    return (
      <>
        <div className='flex flex-row gap-2'>
          {/* {
            oldImages.map( 
              (file, key) => 
                <div key={key} className="relative">
                  <div onClick={() => removeImage(file)} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer">
                    ✕
                  </div>
                  <img src={file} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" />
                </div>
            )
          } */}
          {images.map((file, key) => {
            return (
              <div key={key} className="relative">
                <div onClick={() => {removeImage(file);}} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer"
                >✕</div>
                <img className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" src={file}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                      `http://localhost:3000/${file}`;
                  }}
                />
              </div>
            );
          })}
        </div>
      </>
    );

  }

  return (
    <div className='lg:px-36'>
      <div id='title-hack-container' className=''>
        <section className='pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center'>
          <div className='lg:w-5/6 justify-start'>
            <h1 className=' text-2xl  font-bold mb-2 font-bold'>Update Product</h1>
          </div>
        </section>
      </div>
      <form action="" onSubmit={e=>{e.preventDefault(); handleUpdate(String(product.id));}} className='lg:flex lg:flex-row'>
        <section className='px-4 lg:w-1/2 flex lg:flex-col justify-center items-center space-y-4'>
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
              <select value={form?.categoryId} name="product-category" id="product-category-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const product = await prisma.product.findFirst({
        where: { id: Number(context.query.id)},
        select:{
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            description: true,
            image: true
        }
    })
    return { props: {product} }
}