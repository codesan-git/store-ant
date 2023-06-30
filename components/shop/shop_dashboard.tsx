import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { 
  HiHome, HiChartPie, HiChatBubbleBottomCenterText, 
  HiShoppingBag, HiCurrencyDollar, HiChevronDown,
  HiChevronUp
} from "react-icons/hi2";

interface Props {
  shop:{
    id: Number,
    shopName: string,
    averageRating: Number,
    balance: number,
  }
}

const ShopDashboard = ({ shop }: Props) => {

  const {data: session} = useSession();
  
  const [isSalesDropdownClosed, setIsSalesDropdownClosed] = useState<Boolean>(true);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(shop.balance).toString();

  return(
    <div id='shop-dashboard' className="bg-transparent lg:bg-gray-300 lg:shadow-md lg:w-1/6 "> {/*Try to use drawer here*/}
      <div id="shop-profile" className="bg-gray-300 flex flex-row lg:flex-col justify-start lg:justify-center items-center px-4 lg:px-2 py-4 lg:space-y-2 space-x-4 lg:space-x-0">
        <div id="profile-photo-container" className="">
          <div className="w-16 lg:w-24 rounded-full border border-black">
            <img src={session?.user.image!} alt="" className="rounded-full" />
          </div>
        </div>
        <div id="shop-details-container" className="flex flex-col items-start lg:items-center lg:space-y-1">
          <h1 className="font-bold">{shop.shopName}</h1>
          <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
          <button className="hidden lg:block rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
            <Link href={'/shop/profile'} className="flex justify-center items-center">
              Edit Toko
            </Link>
          </button>
          <h1 className="text-sm lg:hidden">Kas: {formatKas()}</h1>
        </div>
      </div>
      <div id="shop-stats" className="bg-gray-300 invisible lg:visible py-2 px-4 h-4 lg:h-auto border border-y-gray-600">
        <h1 className="">Kas: {formatKas()}</h1>
      </div>
      <div id="shop-dashboard-navigation" className="bg-gray-300 p-2">
        <ul className="">
          <li>
            <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiHome className="h-6 w-6"/>
              <span className="ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChatBubbleBottomCenterText className="h-6 w-6"/>
              <span className="ml-3">Chat</span>
            </Link>
          </li>
          <li>
            <button type="button" onClick={() => setIsSalesDropdownClosed(!isSalesDropdownClosed)} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300" >
              <HiCurrencyDollar className="h-6 w-6"/>
              <span className="flex-1 ml-3 text-left">Sales</span>
              {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6"/> : <HiChevronUp className="h-6 w-6"/>}
            </button>
            <ul id="sales-ul-dropdown" hidden={isSalesDropdownClosed.valueOf()} className="transition duration-75 bg-gray-200">
              <li>
                <Link href={'/shop/orders'} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Orders
                </Link>
              </li>
              <li>
                <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Complaints
                </Link>
              </li>
              <li>
                <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Reviews
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChartPie className="h-6 w-6"/>
              <span className="ml-3">Stats</span>
            </Link>
          </li>
          <li>
            <Link href={'/shop/withdrawals'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChatBubbleBottomCenterText className="h-6 w-6"/>
              <span className="ml-3">Withdraw</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

  //old code
  return(
    <div id='shop-dashboard' className="lg:shadow-md lg:w-1/6 bg-gray-300"> {/*Try to use drawer here*/}
      <div id="shop-profile" className="flex flex-row lg:flex-col justify-start lg:justify-center items-center px-2 py-4 space-y-2">
        <div id="profile-photo-container" className="avatar">
          <div className="w-12 lg:w-24 rounded-full border border-black">
            <img src={session?.user.image!} alt="" />
          </div>
        </div>
        <div id="shop-details-container" className="">
          <h1 className="font-bold">{shop.shopName}</h1>
          <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
          <button className="hidden lg:block rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
            <Link href={'/shop/profile'} className="flex justify-center items-center">
              Edit Toko
            </Link>
          </button>
        </div>
      </div>
      <div id="shop-stats" className="py-2 px-4 border border-y-gray-600">
        <h1>Kas: {formatter.format(shop.balance)}</h1>
      </div>
      <div id="shop-dashboard-navigation" className="p-2">
        <ul className="">
          <li>
            <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiHome className="h-6 w-6"/>
              <span className="ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChatBubbleBottomCenterText className="h-6 w-6"/>
              <span className="ml-3">Chat</span>
            </Link>
          </li>
          <li>
            <button type="button" onClick={() => setIsSalesDropdownClosed(false)} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300" >
              <HiCurrencyDollar className="h-6 w-6"/>
              <span className="flex-1 ml-3 text-left">Sales</span>
              {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6"/> : <HiChevronUp className="h-6 w-6"/>}
            </button>
            <ul id="sales-ul-dropdown" hidden={isSalesDropdownClosed.valueOf()} className="transition duration-75 bg-gray-200">
              <li>
                <Link href={'/shop/orders'} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Orders
                </Link>
              </li>
              <li>
                <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Complaints
                </Link>
              </li>
              <li>
                <Link href={''} className="flex p-2 pl-11 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                  Reviews
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChartPie className="h-6 w-6"/>
              <span className="ml-3">Stats</span>
            </Link>
          </li>
          <li>
            <Link href={'/shop/withdrawals'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
              <HiChatBubbleBottomCenterText className="h-6 w-6"/>
              <span className="ml-3">Withdraw</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

}

export default ShopDashboard;