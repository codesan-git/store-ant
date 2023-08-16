import { Shop, User, Profile, Address } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props{
    shop: Shop & {
      user: {
        id: string;
        image: string;
        name: string;
      };
    };
    location: string
}

interface Cost {
  cost:{
    etd: string,
    value: number
  }[],
  service: string
}

const ShopDetailCard = ({shop, location}: Props) => {

  // const {selectedTransaction} = shop?.user?.

  // const [cost, setCost] = useState<Cost>();

  const session = useSession();
  const router = useRouter();

  const [isUser, setIsUser] = useState<boolean>(false);

  const onPenjualClick = () => {
    router.push(`/transactions?newChatUserId=${shop.userId}`);
  }

  const routeToShop = ()=> {
    router.push({
      pathname: `/shop/detail/${shop.shopName}`,
    })
  }

  useEffect(() => {
    if(shop.userId === session.data?.user.id) setIsUser(true);
  }, []);

  //console.log(`data shop`, location)
  return (
    <>
      <div id="shop-details" className=''>
        <div id='shop-mini-profile' className='flex flex-row w-auto py-2 border-b-2 border-b-black-800'>
          <div id='shop-profile-picture-container' className='mr-2 w-1/3 flex items-center justify-center sm:w-24 lg:w-28'>
            {shop.image ? (
              <Image 
                className='object-cover rounded-full w-16 h-16 sm:w-16 sm:h-16 lg:w-24 lg:h-24 border-2 border-gray-600'
                src={shop?.user.image}
                width={1500}
                height={1500}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                    "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                }}
                alt=''
              />
            ) : (
              <Image 
                className='object-cover rounded-full w-16 h-16 sm:w-16 sm:h-16 lg:w-24 lg:h-24 border-2 border-gray-600'
                src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                alt=''
                width={1500}
                height={1500}
              />
            )}
          </div>
          <div id='profile-details' className='w-2/3 sm:w-full '>
            <h1 className='text-2xl cursor-pointer' onClick={()=>routeToShop()}>{shop.shopName}</h1>
            <div className="lg:flex lg:flex-row">
              <div className="lg:flex lg:flex-row ">
                <div id="store-rating" className="flex flex-row">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-blue-gray-300">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <p className="pl-2">
                    {Number.parseFloat(String(shop.averageRating)).toFixed(2)} <span className='text-gray-600'>rata-rata ulasan</span>
                  </p>
                </div>
                <div className="hidden lg:block">
                  &nbsp;|&nbsp;
                </div>
                <div id="delivery-time" className="flex flex-row">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-blue-gray-300">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                  <p className="pl-2">
                    ± 1 jam<span className='text-gray-600'>&nbsp;pesanan diproses</span> 
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2  mt-2">
              <button hidden={isUser} onClick={onPenjualClick} className="w-full md:w-48 p-2 bg-blue-700 hover:bg-blue-500 transition text-white">
                Tanya Penjual
              </button>
            </div>
          </div>
      </div>
      <div id='deliveries-and-offers' className='py-2 space-y-2'>
        <div id='delivery-details' className='space-y-2'>
          <h1 className='text-2xl'>Pengiriman</h1>
            <div id='store-location-information' className='flex flex-row'>
              <div id='location-icon-container'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div id='location-information' className='px-2'>
                <p className='font-thin flex flex-row'>
                    Dikirim dari <span className='font-bold'>&nbsp;{location}</span>
                </p>
              </div>
            </div>
            <div id='transportation-fees-information' className='flex flex-row'>
              <div id='location-icon-container'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div id='location-information flex flex-row' className='px-2'>
                <p className='font-thin' >
                    Ongkir Reguler 8 - 11,5 rb
                </p>
                <p className='font-thin' >
                    <span className='font-thin text-gray-600'>Estimasi tiba 20 - 22 Apr</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopDetailCard;