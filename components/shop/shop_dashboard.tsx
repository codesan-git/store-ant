import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { 
  HiHome, HiChartPie, HiChatBubbleBottomCenterText, 
  HiShoppingBag, HiCurrencyDollar, HiChevronDown,
  HiChevronUp,
  HiPencilSquare
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
  
  const [isSalesDropdownClosed, setIsSalesDropdownClosed] = useState<boolean>(true);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formatKas = () => formatter.format(shop.balance).toString();

  const renderSalesModal = () => {
    return(
      <div hidden={isSalesDropdownClosed} id="sales-bottom-modal" className="lg:hidden align-bottom bg-gray-900 bg-opacity-75 fixed w-full h-full -top-2 right-0 left-0 bottom-0 z-50">
        <div className="h-1/2" onClick={() => setIsSalesDropdownClosed(true)}>
          {/* This exists just so that the content gets pushed down. I could do without having this div, but it would require flex and align-bottom to do so and the modal would still appear despite closing it*/}
        </div>
        <div id="berlangsung-modal-box" className="p-2 bg-white h-1/2 w-full rounded-lg overflow-y-hidden overscroll-contain">
          <div id="main-menu-modal-x-container" className="flex flex-row space-x-2">
            <button onClick={() => setIsSalesDropdownClosed(true)} className="font-bold text-2xl">✕</button>
            <h1 className="font-bold text-2xl">Sales</h1>
          </div>
          <div id="berlangsung-modal-content">
            <ul>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Unpaid
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Waiting Confirmation
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Ongoing
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Finish
                  </h1>
                </div>
              </li>
              <li>
                <div className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                  <h1 className="flex justify-center items-center text-center lg:pl-6">
                    Return
                  </h1>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return(
    <Fragment>
      <div id='shop-dashboard' className="bg-transparent lg:bg-gray-300 lg:shadow-md lg:w-1/6 "> {/*Try to use drawer here*/}
        <div id="shop-profile" className="bg-gray-300 flex flex-row lg:flex-col justify-start lg:justify-center">
          <div id="photo-and-details-container" className="flex flex-row lg:flex-col justify-start lg:justify-center px-4 lg:px-2 py-4 lg:space-y-2 space-x-4 lg:space-x-0">
            <div id="profile-photo-container" className="">
              <div className="w-16 lg:w-24 rounded-full border border-black">
                <img src={session?.user.image!} alt="" className="rounded-full" />
              </div>
            </div>
            <div id="shop-details-container" className="flex-1 flex-col items-start lg:items-center lg:space-y-1">
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
          <div id="edit-profile-button-mobile" className="lg:hidden bg-deep-orange-800 h-full">
            <HiPencilSquare className="h-6 w-6"/>
          </div>
        </div>
        <div id="shop-stats" className="bg-gray-300 invisible lg:visible lg:py-2 lg:px-4 h-2 lg:h-auto border border-y-gray-600">
          <h1 className="">Kas: {formatKas()}</h1>
        </div>
        <div id="shop-dashboard-navigation" className="lg:p-2 lg:bg-gray-300">
          <ul className="flex flex-row overflow-y-auto space-x-2 lg:space-x-0 lg:flex-col">
            <li className="bg-gray-300 lg:bg-none">
              <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                <HiHome className="h-6 w-6"/>
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li className="bg-gray-300 lg:bg-none">
              <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                <HiChatBubbleBottomCenterText className="h-6 w-6"/>
                <span className="ml-3">Chat</span>
              </Link>
            </li>
            <li id="sales-mobile-version" className="lg:hidden bg-gray-300 lg:bg-none">
              <button onClick={() => {setIsSalesDropdownClosed(false)}} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300">
                <HiCurrencyDollar className="h-6 w-6"/>
                <span className="flex-1 ml-3 text-left">Sales</span>
                {isSalesDropdownClosed ? <HiChevronDown className="h-6 w-6"/> : <HiChevronUp className="h-6 w-6"/>}
              </button>
            </li>
            <li id="sales-web-version" className="hidden lg:block bg-gray-300 lg:bg-none">
              <button type="button" onClick={() => setIsSalesDropdownClosed(!isSalesDropdownClosed)} className="flex items-center whitespace-nowrap w-full p-2 text-base font-normal rounded-lg hover:bg-gray-300">
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
            <li className="bg-gray-300 lg:bg-none">
              <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                <HiChartPie className="h-6 w-6"/>
                <span className="ml-3">Stats</span>
              </Link>
            </li>
            <li className="bg-gray-300 lg:bg-none"> 
              <Link href={'/shop/withdrawals'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                <HiChatBubbleBottomCenterText className="h-6 w-6"/>
                <span className="ml-3">Withdraw</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {renderSalesModal()}
    </Fragment>
  );

}

export default ShopDashboard;