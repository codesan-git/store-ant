import React from 'react'
import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

interface FormData{
    shopname: string,
    address: string
}

export default function CreateShop() {
  const [form, setForm] = useState<FormData>({shopname: '', address: ''})
  const router = useRouter()
  
  async function create(data:FormData) {
    try{
        fetch('/api/shop/setting', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> { setForm({shopname: '', address: ''}); router.back() })
    }catch(error){
        //console.log(error)
    }
  }

  const handleSubmit = async(data: FormData) => {
    try{
        create(data)
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Register Shop</h1>
                <p className="mx-auto text-gray-400">Start your own shop</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(form)}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="text" name="name" placeholder="Name" className={styles.input_text} value={form?.shopname} onChange={e => setForm({...form, shopname: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Register</button>
                </div>
            </form>
        </section>
    </div>
  )
}
