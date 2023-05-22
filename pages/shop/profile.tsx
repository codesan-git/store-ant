import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { GetServerSideProps } from "next";
import { Shop } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { prisma } from "../../lib/prisma"

interface ShopData{
    shop: Shop
}

export default function Profile(shopData : ShopData) {
    const [name, setName] = useState(shopData.shop.shopName);
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleUpload = async () => {
        try {
            if(!selectedFile) return;
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("name", name);
            await axios.post('http://localhost:3000/api/shop/profile', formData).then(() => {router.back() });
        } catch (error: any) {
            //console.log(error);
        }
    }

    return (
        <div>
            <section className="w-3/4 mx-auto flex flex-col gap-10">
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold py-4">Edit Shop</h1>
                    <p className="mx-auto text-gray-400">Edit Shop</p>
                </div>
                <form onSubmit={e=>{e.preventDefault(); handleUpload();}} className="flex flex-col gap-5">
                    <div className='max-w-4xl mx-auto p-20 space-y-6'>
                        <label>
                            <input 
                                type='file' 
                                hidden 
                                onChange={({target}) => {
                                    if(target.files){
                                        const file = target.files[0];
                                        setSelectedImage(URL.createObjectURL(file));
                                        setSelectedFile(file);
                                    }
                                }}
                            />
                            <div className='w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer'>
                                {selectedImage? (
                                    <img src={selectedImage} alt=""/>
                                ) : (
                                    <div>
                                        {shopData.shop.image? (
                                            <img src={`http://localhost:3000/${shopData.shop.image}`} alt=""/>
                                        ) : (
                                            <span>Select Image</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                    <div>
                        <input type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                        {/* <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25}/>
                        </span> */}
                    </div>
                    <div>
                        <button type="submit">Save</button>
                    </div>
                </form>
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
  