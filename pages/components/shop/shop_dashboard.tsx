import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiHome, HiChartPie, HiChatBubbleBottomCenterText, HiShoppingBag, HiCurrencyDollar } from "react-icons/hi2";

interface Props {
  shop:{
    id: Number,
    shopName: string,
    averageRating: Number
  }
}

const ShopDashboard = ({ shop }: Props) => {

  const {data: session} = useSession();

  return(
    <>
      <div id='dashboard' className="lg:shadow-md lg:w-1/6"> {/*Try to use drawer here*/}
        <div id="shop-profile" className="flex flex-col justify-center items-center px-2 py-4 space-y-2 border border-b-black">
          <div id="profile-photo-container" className="avatar">
            <div className="w-24 rounded-full">
              <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" alt="" />
            </div>
          </div>
          <h1 className="font-bold">{shop.shopName}</h1>
          <h1 className="font-bold">Rating: {shop.averageRating.toString()}/5</h1>
          <button className="rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">Edit</button>
        </div>
        <div id="shop-stats" className="p-2 border border-b-black">
          <h1>Balance: Rp.30.000,00</h1>
        </div>
        <div id="dashboard-navigation" className="p-2">
          <ul className="">
            <li>
              <Link href={''} className="flex p-2 text-base font-normal rounded-2xl transition duration-200 hover:bg-gray-300">
                <HiHome className="h-6 w-6"/>
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li>
              <Link href={''} className="flex p-2 text-base font-normal rounded-2xl transition duration-200 hover:bg-gray-300">
                <HiChatBubbleBottomCenterText className="h-6 w-6"/>
                <span className="ml-3">Chat</span>
              </Link>
            </li>
            <li>
              <Link href={''} className="flex p-2 text-base font-normal rounded-2xl transition duration-200 hover:bg-gray-300">
                <HiShoppingBag className="h-6 w-6"/>
                <span className="ml-3">Products</span>
              </Link>
            </li>
            <li>
              <Link href={''} className="flex p-2 text-base font-normal rounded-2xl transition duration-200 hover:bg-gray-300">
                <HiCurrencyDollar className="h-6 w-6"/>
                <span className="ml-3">Sales</span>
              </Link>
            </li>
              {/*Create dropdown menu here using https://tailwindcomponents.com/component/tailwind-css-sidebar-dropdown*/}
            <li>
              <Link href={''} className="flex p-2 text-base font-normal rounded-2xl transition duration-200 hover:bg-gray-300">
                <HiChartPie className="h-6 w-6"/>
                <span className="ml-3">Stats</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );

}

export default ShopDashboard;