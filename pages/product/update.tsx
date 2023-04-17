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
        image: string
    }
}

interface CategoryModel{
    id: Number,
    category: string
  }

export default function CreateShop({product} : FetchData) {    
  const [name, setName] = useState(product.name);   
  const [price, setPrice] = useState(String(product.price));   
  const [stock, setStock] = useState(String(product.stock)); 
  const [category, setCategory] = useState(String(product.category.id));
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const router = useRouter();
  const {id} = router.query;

  const {data, isLoading} = useSWR<{categories : Array<Category>}>(
    `/api/category/`,
    fetchCategories
  )
  if(!data?.categories){
    return null
  }

  const handleUpdate = async (id: string) => {
    try {
        //if(!selectedFile) return
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("categoryId", category);
        await axios.put(`http://localhost:3000/api/product/${id}`, formData).then(() => { router.back() });
    } catch (error: any) {
        console.log(error);
    }
  }

//   async function update(id: string) {
//     try{
//         console.log("update")
//         fetch(`http://localhost:3000/api/product/${id}`, {
//             body: JSON.stringify({
//                 name: name,
//                 price: price,
//                 stock: stock,
//                 categoryId: category
//             }),
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             method: 'PATCH'
//         }).then(()=> { 
//             setName('')
//             setPrice('') 
//             setStock('') 
//             router.back() 
//         })
//     }catch(error){
//         console.log(error)
//     }
//   }

  const handleSubmit = async(id: string) => {
    try{
        handleUpdate(id)
    }catch(error){
        console.log(error)
    }
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Update Product</h1>
                <p className="mx-auto text-gray-400">Update product</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(String(id))}} className="flex flex-col gap-5">
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
                                <img src={`http://localhost:3000/${product.image}`} alt=""/>
                            )}
                        </div>
                    </label>
                </div>
                <select defaultValue={String(product.category.id)} onChange={e => {e.preventDefault(); setCategory(e.target.value)}} name="categoryOption" id="categoryOption">
                    {data.categories.map(category =>(
                        <option value={category.id} key={category.id}>{category.category}</option>
                    ))}
                </select>
                <div className={styles.input_group}>
                    <input type="text" name="name" placeholder="Name" className={styles.input_text} value={name} onChange={e => setName(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <input type="number" name="price" placeholder="Price" className={styles.input_text} value={price} onChange={e => setPrice(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>                
                <div className={styles.input_group}>
                    <input type="number" name="stock" placeholder="Qty" className={styles.input_text} value={stock} onChange={e => setStock(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Save</button>
                </div>
            </form>
        </section>
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
            image: true
        }
    })
    return { props: {product} }
}