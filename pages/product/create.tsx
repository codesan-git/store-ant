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
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Add Product</h1>
                <p className="mx-auto text-gray-400">Add product</p>
            </div>
            <form onSubmit={e=>{e.preventDefault(); handleUpload();}} className="flex flex-col gap-5">
                <div className='max-w-4xl mx-auto p-20 space-y-6'>
                    <label>
                        <input 
                            type='file' 
                            hidden 
                            onChange={({target}) => {
                                if(target.files){
                                    const file = target.files[0];
                                    setSelectedImage(URL.createObjectURL(file));
                                    setSelectedFile(file);
                                }
                            }}
                        />
                        <div className='w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer'>
                            {selectedImage? (
                                <img src={selectedImage} alt=""/>
                            ) : (
                                <span>Select Image</span>
                            )}
                        </div>
                    </label>
                </div>
                <select onChange={e => {e.preventDefault(); setForm({...form, categoryId: e.target.value})}} name="categoryOption" id="categoryOption">
                    {data.categories.map(category =>(
                        <option value={category.id} key={category.id}>{category.category}</option>
                    ))}
                </select>
                <div className={styles.input_group}>
                    <input type="text" name="name" placeholder="Name" className={styles.input_text} value={form?.name} onChange={e => setForm({...form, name: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <textarea name="desc" placeholder="Description" className='w-80 h-40' value={form?.description} onChange={e => setForm({...form, description: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <input type="number" name="price" placeholder="Price" className={styles.input_text} value={form?.price} onChange={e => setForm({...form, price: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>                
                <div className={styles.input_group}>
                    <input type="number" name="stock" placeholder="Qty" className={styles.input_text} value={form?.stock} onChange={e => setForm({...form, stock: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Add</button>
                </div>
            </form>
        </section>
    </div>
  )
}
