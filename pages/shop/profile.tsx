import React, { RefObject, useRef } from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { GetServerSideProps } from "next";
import { Shop } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { prisma } from "../../lib/prisma"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Image from 'next/image';
import {GiShop} from 'react-icons/gi'

interface ShopData {
    shop: Shop
}

type HandleRefClickType = () => void;

export default function Profile(shopData: ShopData) {
    const [name, setName] = useState(shopData.shop.shopName);
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();

    // const inputRef = useRef(null);
    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const handleRefClick:HandleRefClickType = () => {
        inputRef.current?.click();
    }

    async function handleUpload(file: any) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/shop/${name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log("error, ", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const data = { name: name, image: downloadURL };
                    await axios.put("http://localhost:3000/api/shop/profile", data);
                }).then(() => router.reload());
            }
        );
    }

    return (
        <div>
            <section className="w-3/4 mx-auto flex flex-col">
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold py-4">Informasi Toko</h1>
                    <div className="flex mx-auto text-gray-700">
                        <GiShop />{name}
                    </div>
                </div>
                <div className='border rounded-lg'>
                    <form onSubmit={e => { e.preventDefault(); handleUpload(selectedFile); }} className="">
                        <div className='grid grid-cols-2'>
                            <div className='flex my-5 p-5 gap-10 h-48'>
                                <div className='space-y-6'>
                                    <label>
                                        <input
                                            type='file'
                                            hidden
                                            onChange={({ target }) => {
                                                if (target.files) {
                                                    const file = target.files[0];
                                                    setSelectedImage(URL.createObjectURL(file));
                                                    setSelectedFile(file);
                                                }
                                            }}
                                        />
                                        <div className='w-64 h-64 aspect-video rounded-lg flex justify-center border-2 border-dashed'>
                                            {selectedImage ? (
                                                <Image
                                                    src={selectedImage}
                                                    alt=""
                                                    width={1500}
                                                    height={1500}
                                                />
                                            ) : (
                                                <div>
                                                    {shopData.shop.image ? (
                                                        <Image
                                                            src={shopData.shop.image}
                                                            alt=""
                                                            width={1500}
                                                            height={1500}
                                                        />
                                                    ) : (
                                                        <span>Select Image</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <p className='text-sm'>Ukuran optimal 300 x 300 piksel dengan Besar file: Maksimum 10.000.000 bytes (10 Megabytes).Ekstensi file yang diperbolehkan: JPG, JPEG, PNG</p>
                                    <input className='btn btn-outline w-full rounded-md'
                                        ref={inputRef}
                                        style={{ display: 'none' }}
                                        type='file'
                                        onChange={({ target }) => {
                                            if (target.files) {
                                                const file = target.files[0];
                                                setSelectedImage(URL.createObjectURL(file));
                                                setSelectedFile(file);
                                            }
                                        }} />
                                    <div className='btn btn-outline w-full rounded-md' onClick={handleRefClick}>Pilih Foto</div>
                                </div>
                            </div>
                            <div className='relative my-5 p-5 gap-10 h-48'>
                                <div className='w-full border border-gray-600 rounded-md h-10 mb-10'>
                                    <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Name" 
                                    value={name} 
                                    style={{border: "none"}}
                                    onChange={e => setName(e.target.value)} 
                                    className='w-full h-8 px-4 items-center mt-1 border border-none'
                                    />
                                </div>
                                <div className='flex justify-end'>
                                    <button type="submit" className='btn btn-success rounded-md w-24'>Simpan</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    const shop = await prisma.shop.findFirst({
        where: { userId: session?.user.id }
    });

    return {
        props: {
            shop,
        },
    };
};
