import { FC } from 'react'
import { BiShareAlt, BiStore } from 'react-icons/bi'
import { AiFillStar } from 'react-icons/ai'
import { getTypeShop } from '@/types'
import Image from 'next/image'
import { Shop, Product } from '@prisma/client'
import { useSession } from "next-auth/react";

interface ShopHeadProps {
    getShop: Shop & {
        product: Product[]
    }
}

const ShopHead: FC<ShopHeadProps> = ({ getShop }) => {

    const { data: session } = useSession();
    return <>
        <div id='head-desktop' className='hidden lg:block'>
            <div className='grid grid-cols-2 gap-4 border border-red-900'>
                <div className='flex p-4 gap-4'>
                    <div className='my-auto'>
                        <Image
                            src={getShop?.image as string}
                            alt={getShop?.shopName}
                            width={1500}
                            height={1500}
                            className='rounded-full align-middle w-32 h-32'
                        />
                    </div>
                    <div>
                        <h2 className='font-bold text-2xl capitalize mb-1'>{getShop?.shopName}</h2>
                        <h5 className='font-light text-gray-500 mb-1'>Online <span className='text-gray-700'>39 menit lalu •</span> Kab. Tangerang</h5>
                        <div className='flex gap-4'>
                            <div className='btn btn-outline btn-md rounded-md w-36'>Button 1</div>
                            <div className='btn btn-outline btn-md rounded-md w-36'>Chat Penjual</div>
                            <button className='btn btn-square rounded-md'>
                                <BiStore
                                    className='w-6 h-6'
                                />
                            </button>
                            <button className='btn btn-square rounded-md'>
                                <BiShareAlt
                                    className='w-6 h-6'
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-end'>
                    <div id='star-shop' className='mx-4'>
                        <div className='flex justify-center'>
                            <AiFillStar
                                className='text-yellow-900 w-6 h-6 my-auto'
                            />
                            <h3 className='ml-2 align-bottom font-bold text-xl'>{getShop?.averageRating}</h3>
                        </div>
                        <h3 className='text-gray-500'>Rating & Ulasan</h3>
                    </div>
                    <div className='divider divider-horizontal h-1/2 my-auto'></div>
                    <div id='pesanan-shop' className='mx-4'>
                        <div className='flex justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='text-yellow-900 w-5 h-5 align-bottom my-auto'>
                                <path d="M352 448H32c-17.69 0-32 14.31-32 32s14.31 31.1 32 31.1h320c17.69 0 32-14.31 32-31.1S369.7 448 352 448zM48 208H160v111.1c0 17.69 14.31 31.1 32 31.1s32-14.31 32-31.1V208h112c17.69 0 32-14.32 32-32.01s-14.31-31.99-32-31.99H224v-112c0-17.69-14.31-32.01-32-32.01S160 14.33 160 32.01v112H48c-17.69 0-32 14.31-32 31.99S30.31 208 48 208z" />
                            </svg>
                            <h3 className='ml-2 align-bottom font-bold text-xl'>8 jam</h3>
                        </div>
                        <h3 className='text-gray-500'>Pesanan diproses</h3>
                    </div>
                    <div className='divider divider-horizontal h-1/2 my-auto'></div>
                    <div id='operasi-shop' className='mx-4'>
                        <div className='flex'>
                            <h3 className='ml-2 align-bottom font-bold text-xl text-left'>09:00 - 18:00</h3>
                        </div>
                        <h3 className='text-gray-500'>Rating & Ulasan</h3>
                    </div>
                </div>
            </div>
        </div>
        <div id='head-mobile' className='lg:hidden'>
            <div className=' gap-4 border'>
                <div className='flex py-2 gap-4'>
                    <div className='my-auto'>
                        {getShop?.image === null ?
                            <>
                                <Image
                                    src={session?.user.image as string}
                                    alt=''
                                    width={1500}
                                    height={1500}
                                    className='rounded-full align-middle w-16 h-16 '
                                />
                            </>
                            :
                            <>
                                <Image
                                    src={getShop?.image as string}
                                    alt={getShop?.shopName}
                                    width={1500}
                                    height={1500}
                                    className='rounded-full align-middle w-16 h-16'
                                />
                            </>
                        }
                    </div>
                    <div>
                        <h2 className='font-bold text-xl capitalize mb-1'>{getShop?.shopName}</h2>
                        <h5 className='font-light text-sm text-gray-500'>Online <span className='text-gray-700'>39 menit lalu •</span> Kab. Tangerang</h5>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <div id='star-shop'>
                        <div className='flex justify-center'>
                            <AiFillStar
                                className='text-yellow-900 w-4 h-4 my-auto'
                            />
                            <h3 className='ml-1 align-bottom font-bold text-sm'>{getShop?.averageRating}</h3>
                        </div>
                        <h3 className='text-gray-500 text-sm mx-auto'>Rating & Ulasan</h3>
                    </div>
                    {/* <div className='divider divider-horizontal h-1/2 my-auto'></div> */}
                    <div id='pesanan-shop'>
                        <div className='flex justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='text-yellow-900 w-3 h-3 align-bottom my-auto'>
                                <path d="M352 448H32c-17.69 0-32 14.31-32 32s14.31 31.1 32 31.1h320c17.69 0 32-14.31 32-31.1S369.7 448 352 448zM48 208H160v111.1c0 17.69 14.31 31.1 32 31.1s32-14.31 32-31.1V208h112c17.69 0 32-14.32 32-32.01s-14.31-31.99-32-31.99H224v-112c0-17.69-14.31-32.01-32-32.01S160 14.33 160 32.01v112H48c-17.69 0-32 14.31-32 31.99S30.31 208 48 208z" />
                            </svg>
                            <h3 className='ml-1 align-bottom font-bold text-sm'>8 jam</h3>
                        </div>
                        <h3 className='text-gray-500 text-sm'>Pesanan diproses</h3>
                    </div>
                    {/* <div className='divider divider-horizontal h-1/2 my-auto'></div> */}
                    <div id='operasi-shop' className='mx-4'>
                        <div className='flex justify-center'>
                            <h3 className='ml-2 align-bottom font-bold text-sm text-left'>09:00 - 18:00</h3>
                        </div>
                        <h3 className='text-gray-500 text-sm'>Jam Operasional</h3>
                    </div>
                </div>
                <div className='flex gap-x-2 my-2 justify-center'>
                    <div className='grid grid-cols-2 gap-x-2 w-full'>
                        <div className='btn btn-outline btn-xs w-full capitalize font-bold'>Chat</div>
                        <div className='btn btn-outline btn-xs w-full capitalize font-bold'>Following</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ShopHead