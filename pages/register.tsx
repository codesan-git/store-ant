import React from 'react'
import Head from 'next/head'
import Layout from '@/layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useState } from 'react';

export default function Register() {
  const [show, setShow] = useState<boolean>();

  async function handleGoogleSignIn() {
    signIn('google', {callbackUrl: "http://localhost:3000"})
  }

  return (
    <Layout>
        <Head>
            <title>Register</title>
        </Head>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Register</h1>
                <p className="w-3/4 mx-auto text-gray-400">Create a new account with Google</p>
            </div>

            <form className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <button onClick={ handleGoogleSignIn } type="button" className={styles.button_custom}>Sign In with Google <Image alt='' src={'/assets/google.svg'} width="20" height={20}></Image></button>
                </div>
            </form>
            <p className="text-center text-gray-400">already have an account? <Link className="text-blue-700" href={'/login'}>Sign In</Link></p>
        </section>
    </Layout>
  )
}
