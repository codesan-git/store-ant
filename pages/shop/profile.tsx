import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { GetServerSideProps } from "next";
import { Shop } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { prisma } from "../../lib/prisma"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";

interface ShopData{
    shop: Shop
}

export default function Profile(shopData : ShopData) {
    const [name, setName] = useState(shopData.shop.shopName);
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();

    async function handleUpload(file: any){
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
                    const data = {name: name, image: downloadURL};
                    await axios.put("http://localhost:3000/api/shop/profile", data);
                }).then(() => router.reload());
            }
        );
    }

    return (
        <div>
            <section className="w-3/4 mx-auto flex flex-col gap-10">
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold py-4">Edit Shop</h1>
                    <p className="mx-auto text-gray-400">Edit Shop</p>
                </div>
                <form onSubmit={e=>{e.preventDefault(); handleUpload(selectedFile);}} className="flex flex-col gap-5">
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
                                            <img src={shopData.shop.image} alt=""/>
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
  