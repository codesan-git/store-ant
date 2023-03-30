import React from 'react'
import Head from 'next/head'
import Layout from '@/layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css'
import Image from 'next/image'
import { HiAtSymbol, HiKey } from 'react-icons/hi'
import { useState } from 'react';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

interface FormData{
    email: string,
    password: string,
}

export default function Login() {
  const [show, setShow] = useState<boolean>();
  const [form, setForm] = useState<FormData>({email: '', password: ''});
  const router = useRouter()

  async function handleGoogleSignIn() {
    signIn('google', {callbackUrl: "http://localhost:3000"})
  }

  async function loginUser(data: FormData){
    console.log("login")
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: `${window.location.origin}`,
    });

    res?.error ? console.log("ERROR ", res?.error) : router.push('/');
  };

  return (
    <Layout>
        <Head>
            <title>Login</title>
        </Head>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Store.ant</h1>
                <p className="w-3/4 mx-auto text-gray-400">lorem ipsum dolor sit amet</p>
            </div>

            <form onSubmit={e => {e.preventDefault(); loginUser(form)}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="email" name="email" placeholder="Email" className={styles.input_text} value={form?.email} onChange={e => setForm({...form, email: e.target.value})}/>
                    <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span>
                </div>
                <div className={styles.input_group}>
                    <input type={`${show?"text": "password"}`} name="password" placeholder="Password" className={styles.input_text} value={form?.password} onChange={e => setForm({...form, password: e.target.value})}/>
                    <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span>
                </div>

                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Login</button>
                </div>
                <div className={styles.input_group}>
                    <button type="button" onClick={ handleGoogleSignIn } className={styles.button_custom}>Sign In with Google <Image alt='' src={'/assets/google.svg'} width="20" height={20}></Image></button>
                </div>
            </form>
            <p className="text-center text-gray-400">don't have an account yet? <Link className="text-blue-700" href={'/register'}>Sign Up</Link></p>
        </section>
    </Layout>
  )
}
