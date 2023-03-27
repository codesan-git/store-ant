import React from 'react'
import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'

interface FormData{
    name: string,
    price: string
}

export default function CreateShop() {
  const [form, setForm] = useState<FormData>({name: '', price: ''});
  
  async function create(data:FormData) {
    try{
        fetch('http://localhost:3000/api/product/create', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> setForm({name: '', price: ''}))
    }catch(error){
        console.log(error)
    }
  }

  const handleSubmit = async(data: FormData) => {
    try{
        create(data)
    }catch(error){
        console.log(error)
    }
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Add Product</h1>
                <p className="mx-auto text-gray-400">Add product</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(form)}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="text" name="name" placeholder="Name" className={styles.input_text} value={form?.name} onChange={e => setForm({...form, name: e.target.value})}/>
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
                    <button type="submit" className={styles.button}>Add</button>
                </div>
            </form>
        </section>
    </div>
  )
}
