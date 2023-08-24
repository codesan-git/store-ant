import React from 'react'
import styles from '../styles/Layout.module.css'

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <div className="flex h-screen">
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
