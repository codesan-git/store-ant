import React from 'react'
import styles from '../../styles/Form.module.css'
import Image from 'next/image'
import { useState } from 'react';
import { HiAtSymbol, HiKey } from 'react-icons/hi'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"

interface FormData{
    username: string,
    phonenumber: string,
    password: string
}

interface Props {
    profile:{
        id: Number,
        username: string,
        phoneNumber: string,
    }

    address:{
        id: Number,
        address: string,
        region: string,
        city: string,
        province: string,
        postcode: string
    }[]
}

export default function Profile({profile, address} : Props) {
  const [form, setForm] = useState<FormData>({username: profile?.username, phonenumber: profile?.phoneNumber, password: ''});
  const [show, setShow] = useState<boolean>();
  const router = useRouter()
  const{data:session} = useSession()

  console.log(address)

  async function create(data:FormData) {
    try{
        fetch('http://localhost:3000/api/profile/setting', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> { setForm({username:data.username, password:'', phonenumber:data.phonenumber}); router.push(router.asPath) })
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
    <div className='flex my-5'>
        <div className='text-center justify-center mt-10 ml-5'>
            <div className="avatar">
                <div className="w-24 rounded-full">
                    <img src={session?.user?.image!} width="300" height="300" />
                </div>
            </div>
            <div className='details font-bold text-lg'>
                <h5>{session?.user?.name}</h5>
                <h5>{session?.user?.email}</h5>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-full bg-base-100 text-base-content">
                <li><a>Profile</a></li>
                <li><a>Orders</a></li>
                <li><a>Vouchers</a></li>
                </ul>
            </div>
        </div>
        <div className='w-full mx-10'>
            <section className="mt-8 flex flex-col gap-10 bg-gray-100 p-10 rounded-md">
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold">Profile</h1>
                    <p className="mx-auto text-gray-400">Input profile data</p>
                </div>

                <form onSubmit={e=>{e.preventDefault(); handleSubmit(form)}} className="flex flex-col gap-5">
                    <div className={styles.input_group}>
                        <label className='my-auto ml-3 mr-4'>Username</label>
                        <input type="text" name="username" placeholder="Username" className={styles.input_text} value={form?.username} onChange={e => setForm({...form, username: e.target.value})}/>
                        {/* <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25}/>
                        </span> */}
                    </div>
                    <div className={styles.input_group}>
                        <label className='my-auto ml-3 mr-12'>Phone</label>
                        <input type="number" name="phonenumber" placeholder="Phone Number" className={styles.input_text} value={form?.phonenumber} onChange={e => setForm({...form, phonenumber: e.target.value})}/>
                        {/* <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25}/>
                        </span> */}
                    </div>                
                    <div className={styles.input_group}>
                        <label className='my-auto ml-3 mr-5'>Password</label>
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
            <section className="mt-8 flex flex-col gap-10 bg-gray-100 p-10 rounded-md">
                <div className='flex'>
                    <div className="title w-full">
                        <h1 className="text-gray-800 text-4xl font-bold">Address</h1>
                        <p className="mx-auto text-gray-400">Address list</p>
                    </div>
                    <button className={styles.button_square} onClick={()=> router.push('/address')}>+</button>
                </div>
                {address? 
                    <div>
                        {address.map(address=>(
                            <div className="card w-full bg-base-100 shadow-xl text-sm" key={String(address.id)}>
                                <div className="py-5 px-10 flex w-full">
                                    <div className='w-5/6'>
                                        <h2 className="card-title">{address.address}</h2>
                                        <p>{address.region}, {address.city}, {address.province}</p>
                                        <p>{address.postcode}</p>
                                    </div>
                                    <div className="card-actions justify-end flex w-fit my-auto ml-5">
                                        <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-indigo-500">Edit</button>
                                        <button className="btn btn-primary bg-red-500">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> : 
                    <p>address not added yet</p>
                }
            </section>
        </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = await prisma.user.findUnique({
        where: { email: String(context.query.email) },
        select: {
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
    let address = null
    if(profile){
        address = await prisma.address.findMany({
            where: { profileId: profile?.id },
            select:{
                id: true,
                address: true,
                region: true,
                city: true,
                province: true,
                postcode: true
            }
        })
    }
    return { props: {profile, address} }
}