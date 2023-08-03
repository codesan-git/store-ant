import React from 'react'
import styles from '../../styles/Form.module.css'
import Image from 'next/image'
import { useState } from 'react';
import { HiAtSymbol, HiKey } from 'react-icons/hi'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"

interface FormData{
    username: string,
    phonenumber: string,
    password: string,
    address: string
}

interface Profile {
    profile:{
        id: Number,
        username: string,
        phoneNumber: string,
    }
}

export default function EditProfile({profile} : Profile) {
  const [form, setForm] = useState<FormData>({username: profile?.username, phonenumber: profile?.phoneNumber, password: '', address: ''});
  const [show, setShow] = useState<boolean>();
  const router = useRouter()
  const{data:session} = useSession()

  async function create(data:FormData) {
    try{
        fetch('/api/profile/setting', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> { setForm({username:'', password:'', phonenumber:'', address:''}); router.back() })
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
    <div >
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Profile</h1>
                <p className="mx-auto text-gray-400">Input profile data</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(form)}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="text" name="username" placeholder="Username" className={styles.input_text} value={form?.username} onChange={e => setForm({...form, username: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <input type="number" name="phonenumber" placeholder="Phone Number" className={styles.input_text} value={form?.phonenumber} onChange={e => setForm({...form, phonenumber: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <input type="text" name="address" placeholder="Address" className={styles.input_text} value={form?.address} onChange={e => setForm({...form, address: e.target.value})}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>
                
                <div className={styles.input_group}>
                    <input type={`${show?"text": "password"}`} name="password" placeholder="Password" className={styles.input_text} value={form?.password} onChange={e => setForm({...form, password: e.target.value})}/>
                    <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span>
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
    const user = await prisma.user.findUnique({
        where: { email: String(context.query.email) },
        select:{
            id: true
        }
    })
    const profile = await prisma.profile.findUnique({
        where: { userId: user?.id },
        select:{
            id: true,
            username: true,
            phoneNumber: true
        }
    })
    return { props: {profile} }
}