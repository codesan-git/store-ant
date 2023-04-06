import React from 'react'
import styles from '../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

interface FormData{
    address: string,
    region: string,
    city: string,
    province: string,
    postcode: string,
    contact: string
}

export default function Address() {
  const [form, setForm] = useState<FormData>({address: '', region: '', city: '', province: '', postcode: '', contact: ''})
  const router = useRouter()
  
  async function create(data:FormData) {
    try{
        fetch('http://localhost:3000/api/address/create', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> { setForm({address: '', region: '', city: '', province: '', postcode: '', contact: ''}); router.back() })
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
                <h1 className="text-gray-800 text-4xl font-bold py-4">Add Address</h1>
                <p className="mx-auto text-gray-400">Input address details</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(form)}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="text" name="address" placeholder="Address" className={styles.input_text} value={form?.address} onChange={e => setForm({...form, address: e.target.value})}/>
                </div>
                <div className={styles.input_group}>
                    <input type="text" name="region" placeholder="Region" className={styles.input_text} value={form?.region} onChange={e => setForm({...form, region: e.target.value})}/>
                </div>                
                <div className={styles.input_group}>
                    <input type="text" name="city" placeholder="City" className={styles.input_text} value={form?.city} onChange={e => setForm({...form, city: e.target.value})}/>
                </div>                
                <div className={styles.input_group}>
                    <input type="text" name="province" placeholder="Province" className={styles.input_text} value={form?.province} onChange={e => setForm({...form, province: e.target.value})}/>
                </div>
                <div className={styles.input_group}>
                    <input type="text" name="postcode" placeholder="Postcode" className={styles.input_text} value={form?.postcode} onChange={e => setForm({...form, postcode: e.target.value})}/>
                </div>
                <div className={styles.input_group}>
                    <input type="number" name="contact" placeholder="Contact Number" className={styles.input_text} value={form?.contact} onChange={e => setForm({...form, contact: e.target.value})}/>
                </div>

                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Save</button>
                </div>
            </form>
        </section>
    </div>
  )
}
