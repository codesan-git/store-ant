import React from 'react'
import styles from '../styles/Layout.module.css'
import Link from 'next/link'
import { ImCross } from "react-icons/im";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen">
            <Link className="absolute top-20 right-44 cursor-pointer" href={"/"} passHref>
                <ImCross size={20} color='#424242' />
            </Link>
            <div className="m-auto bg-slate-50 rounded-md w-[65%] grid lg:grid-cols-2">
                <div className={styles.imgStyle}>
                    <div className={styles.cartoonImg}></div>
                    <div className={styles.cloud_one}></div>
                    <div className={styles.cloud_two}></div>
                </div>
                <div className="right-flex flex-col justify-evenly">
                    <div className="text-center py-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
