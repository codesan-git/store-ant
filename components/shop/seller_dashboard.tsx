import { TransactionStatus, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
    HiChevronDown, HiChevronUp, HiHome, HiChartPie, HiChatBubbleBottomCenterText,
    HiShoppingBag, HiCurrencyDollar,
    HiPencilSquare
} from "react-icons/hi2";

interface Props {
    shop: {
        shopName: string,
        balance: number,
        image: string,
        averageRating: number
    },
    TransactionDashboardArguments: () => any
}
interface Order {
    id: number,
    transactionId: number,
    productId: number,
    count: number,
    createdAt: Date,
    updatedAt: Date,
    product: Product
}
interface Transaction {
    id: number,
    userId: number,
    shopId: number,
    status: TransactionStatus,
    createdAt: Date,
    updatedAt: Date,
    paymentMethod: string,
    order: Order[],
    shop: {
        shopName: string,
        balance: number,
        image: string,
        averageRating: number
    },
    user: {
        name: string
    }
}

const SellerDashboard = ({ TransactionDashboardArguments, shop }: Props) => {

    const {
        allTransactions,
        setItemsToDisplay,
        setCurrentSelectedSection
    } = TransactionDashboardArguments();

    const [berlangsungIsOpen, setBerlangsungIsOpen] = useState<Boolean>(false);
    const [isSalesDropdownClosed, setIsSalesDropdownClosed] = useState<Boolean>(false);

    //I'm losing my mind just to make this work - Peter D. //((semangat))
    const menungguPembayaranOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => e.status === TransactionStatus.UNPAID));
        setCurrentSelectedSection("Menunggu Pembayaran");
    }

    const menungguKonfirmasiOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => e.status === TransactionStatus.AWAITING_CONFIRMATION));
        setCurrentSelectedSection("Menunggu Konfirmasi");
    }

    const pesananDiprosesOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => e.status === TransactionStatus.PACKING || e.status === TransactionStatus.CANCELING));
        setCurrentSelectedSection("Pesanan Diproses");
    }

    const pesananDikirimOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => e.status === TransactionStatus.DELIVERING || e.status === TransactionStatus.RETURNING));
        setCurrentSelectedSection("Pesanan Dikirim");
    }

    const berhasilOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => e.status === TransactionStatus.FINISHED || e.status === TransactionStatus.CANCEL_REJECTED || e.status === TransactionStatus.RETURN_REJECTED));
        setCurrentSelectedSection("Berhasil");
    }

    const tidakBerhasilOnClick = () => {
        setItemsToDisplay(allTransactions?.filter((e: any) => (e.status === TransactionStatus.CANCELED || e.status === TransactionStatus.RETURNED)));
        setCurrentSelectedSection("Tidak Berhasil");
    }

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    const formatKas = () => formatter.format(shop.balance).toString();

    const berlangsungBottomModal = () => {
        return (
            <div id="berlangsung-bottom-modal" hidden={!berlangsungIsOpen.valueOf()} className="lg:hidden align-bottom bg-gray-900 bg-opacity-75 fixed w-full h-full -top-2 right-0 left-0 bottom-0 z-50">
                <div className="h-1/2" onClick={() => setBerlangsungIsOpen(false)}>
                    {/* This exists just so that the content gets pushed down. I could do without having this div, but it would require flex and align-bottom to do so and the modal would still appear despite closing it*/}
                </div>
                <div id="berlangsung-modal-box" className="p-2 bg-white h-1/2 w-full rounded-lg overflow-y-hidden overscroll-contain">
                    <div id="main-menu-modal-x-container" className="flex flex-row space-x-2">
                        <button onClick={() => setBerlangsungIsOpen(false)} className="font-bold text-2xl">✕</button>
                        <h1 className="font-bold text-2xl">Berlangsung</h1>
                    </div>
                    <div id="berlangsung-modal-content">
                        <ul>
                            <li>
                                <div onClick={menungguPembayaranOnClick} className="flex justify-start p-1 w-auto h-12 text-xs font-normal hover:bg-gray-300 transition duration-300">
                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                        Menunggu Pembayaran
                                    </div>
                                </div>
                            </li>
                            <li id="berlangsung-mobile-version" className="lg:hidden">
                                <div className="flex justify-start p-1 w-auto h-12 text-xs font-normal hover:bg-gray-300 transition duration-300 " onClick={() => setIsSalesDropdownClosed(!isSalesDropdownClosed)}>
                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                        Berlangsung
                                    </div>
                                    {isSalesDropdownClosed ? <HiChevronUp className="h-6 w-6 my-auto" /> : <HiChevronDown className="h-6 w-6 my-auto" />}
                                </div>
                                {isSalesDropdownClosed &&
                                    <ul>
                                        <li>
                                            <div onClick={menungguKonfirmasiOnClick} className="flex justify-start p-1 w-auto h-12 text-xs font-normal hover:bg-gray-300 transition duration-300">
                                                <div className="flex justify-center items-center text-center lg:pl-6">
                                                    Menunggu Konfirmasi
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div onClick={pesananDiprosesOnClick} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                                                <div className="flex justify-center items-center text-center lg:pl-6">
                                                    Pesanan Diproses
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div onClick={pesananDikirimOnClick} className="flex justify-start p-1 w-auto h-12 text-sm font-normal hover:bg-gray-300 transition duration-300">
                                                <div className="flex justify-center items-center text-center lg:pl-6">
                                                    Pesanan Dikirim
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                }
                            </li>
                            <li>
                                <div onClick={berhasilOnClick} className="flex justify-start p-1 w-auto h-12 text-xs font-normal hover:bg-gray-300 transition duration-300">
                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                        Berhasil
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div onClick={tidakBerhasilOnClick} className="flex justify-start p-1 w-auto h-12 text-xs font-normal hover:bg-gray-300 transition duration-300">
                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                        Tidak Berhasil
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        );
    }

    /*    
    * 30/05/2023 Notes by Peter Darmawan
    *
    * So, I have no idea on how to best implement the navigation options list for the transactions dashboard, particularly the "Berlangsung"
    * dropdown that has to be a modal if its in mobile mode but still a dropdown in web view.
    * At the moment of writing, the main problem is that you can't really style a daisyUI dropdown class to become a modal, because the
    * way those two classes are setup makes it hard to implement them at the same time.
    * 
    * Maybe I'm overthinking this, and I haven't really tried it, but based from what I know about daisy UI, you can't mash a modal and a dropdown together.
    * 
    * The back of my mind says that it's better to just create a hybrid entirely from scratch using tailwind and typescript, but I don't have the time to do so.
    * 
    * So with the limited time I have, I opted to create two divs, one for a mobile version and the other for the web version. Either one will
    * be hidden when the user's screen reaches lg screen size.
    * 
    * And I have a gut feeling that this will cause more problems in the future, but lets see. I'm writing this to say "I told you so" when I'm done trying.
    * 
    * yeah, knew it, right at the end of the day I found a critical bug. If you load the page in web, then you click "Sebelumnya", and you change the view into 
    * mobile mode, the modal won't show up, because it needs to be activated by the label that is assigned to it.
    */

    return ( //TODO: Make the dashboard sticky on the Transactions Page
        <Fragment>
            <div id="transactions-dashboard" className="lg:shadow-md w-full bg-none lg:bg-gray-400">
                <div id="photo-and-details-container" className="bg-gray-300 flex flex-row lg:flex-col justify-start lg:justify-center items-center px-4 lg:px-2 py-4 lg:space-y-2 space-x-4 lg:space-x-0">
                    <div id="profile-photo-container" className="">
                        <div className="w-16 lg:w-24 rounded-full border border-black">
                            <img src={`http://localhost:3000/${shop?.image}`} alt="" width={500} height={300} className="rounded-full" />
                        </div>
                    </div>
                    <div id="shop-details-container" className="flex flex-col items-start lg:items-center lg:space-y-1">
                        <h1 className="font-bold">{shop.shopName}</h1>
                        <h1 className="font-bold">Rating: {shop.averageRating}/5</h1>
                        <button className="hidden lg:block rounded-md bg-green-500 hover:bg-green-400 transition duration-200 p-1 w-24 text-white">
                            <Link href={'/shop/profile'} className="flex justify-center items-center">
                                Edit Toko
                            </Link>
                        </button>
                        <h1 className="text-sm lg:hidden">Kas: {formatKas()}</h1>
                    </div>
                </div>
                <div id="shop-stats" className="bg-gray-300 invisible lg:visible lg:py-2 lg:px-4 h-2 lg:h-auto border border-y-gray-600">
                    <h1 className="">Kas: {formatKas()}</h1>
                </div>
                <div id="shop-dashboard-navigation" className="lg:p-2 lg:bg-gray-300">
                    <ul className="flex flex-row overflow-y-auto space-x-2 lg:space-x-0 lg:flex-col">
                        <li className="bg-gray-300 lg:bg-none">
                            <Link href={'/shop'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                                <HiHome className="h-6 w-6" />
                                <span className="ml-3">Home</span>
                            </Link>
                        </li>
                        <li className="bg-gray-300 lg:bg-none">
                            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                                <HiChatBubbleBottomCenterText className="h-6 w-6" />
                                <span className="ml-3">Chat</span>
                            </Link>
                        </li>
                        <li id="berlangsung-mobile-version" className="lg:hidden bg-gray-300 lg:bg-none">
                            <button className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 " onClick={() => setBerlangsungIsOpen(!berlangsungIsOpen)}>
                                <HiCurrencyDollar className="h-6 w-6" />
                                <span className="flex-1 text-left ml-1 lg:ml-0">
                                    Sales
                                </span>
                                {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6" /> : <HiChevronDown className="h-6 w-6" />}
                            </button>
                        </li>
                        <li hidden id="sales-web-version" className="hidden lg:block bg-gray-300 lg:bg-none">
                            <button className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300 " onClick={() => setIsSalesDropdownClosed(!isSalesDropdownClosed)}>
                                <HiCurrencyDollar className="h-6 w-6" />
                                <span className="flex-1 ml-3 text-left">
                                    Sales
                                </span>
                                {isSalesDropdownClosed ? <HiChevronUp className="h-6 w-6" /> : <HiChevronDown className="h-6 w-6" />}
                            </button>
                            {isSalesDropdownClosed &&
                                <ul hidden={!isSalesDropdownClosed.valueOf()} className="flex flex-row lg:flex-col lg:h-auto space-x-2 lg:space-x-0 overflow-x-auto lg:overflow-visible ">
                                    <li>
                                        <div onClick={menungguPembayaranOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 hover:cursor-pointer"> {/*TODO: reduce centering classnames*/}
                                            <span className="flex justify-center items-center text-center">
                                                Menungggu Pembayaran
                                            </span>
                                        </div>
                                    </li>
                                    <li id="berlangsung-mobile-version" className="lg:hidden">
                                        <button className="flex justify-center lg:justify-start items-center text-center p-2 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 " onClick={() => setBerlangsungIsOpen(true)}>
                                            <span className="flex-1 text-left ml-1 lg:ml-0">
                                                Berlangsung
                                            </span>
                                            {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6" /> : <HiChevronDown className="h-6 w-6" />}
                                        </button>
                                        <ul hidden={!berlangsungIsOpen.valueOf()} className="bg-gray-400">
                                            <li>
                                                <div onClick={menungguKonfirmasiOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <span className="flex justify-center items-center text-center lg:pl-6">
                                                        Menunggu Konfirmasi
                                                    </span>
                                                </div>
                                            </li>
                                            <li>
                                                <div onClick={pesananDiprosesOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                                        Pesanan Diproses
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div onClick={pesananDikirimOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                                        Pesanan Dikirim
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li hidden={isSalesDropdownClosed.valueOf()} id="berlangsung-web-version" className="hidden lg:block">
                                        <button className="flex justify-center lg:justify-start items-center text-center p-2 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300" onClick={() => setBerlangsungIsOpen(!berlangsungIsOpen)}>
                                            <span className="flex-1 text-left ml-1 lg:ml-0">
                                                Berlangsung
                                            </span>
                                            {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6" /> : <HiChevronDown className="h-6 w-6" />}
                                        </button>
                                        <ul hidden={!berlangsungIsOpen.valueOf()} className="bg-gray-400">
                                            <li>
                                                <div onClick={menungguKonfirmasiOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <span className="flex justify-center items-center text-center lg:pl-6">
                                                        Menunggu Konfirmasi
                                                    </span>
                                                </div>
                                            </li>
                                            <li>
                                                <div onClick={pesananDiprosesOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                                        Pesanan Diproses
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div onClick={pesananDikirimOnClick} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                                    <div className="flex justify-center items-center text-center lg:pl-6">
                                                        Pesanan Dikirim
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div onClick={berhasilOnClick} className="flex justify-center lg:justify-start items-center text-center p-1 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                            <span className="flex justify-center items-center text-center">
                                                Berhasil
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div onClick={tidakBerhasilOnClick} className="flex justify-center lg:justify-start items-center text-center p-1 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
                                            <span className="flex justify-center items-center text-center">
                                                Tidak Berhasil
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            }
                        </li>
                        <li className="bg-gray-300 lg:bg-none">
                            <Link href={''} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                                <HiChartPie className="h-6 w-6" />
                                <span className="ml-3">Stats</span>
                            </Link>
                        </li>
                        <li className="bg-gray-300 lg:bg-none">
                            <Link href={'/shop/withdrawals'} className="flex p-2 text-base font-normal rounded-lg transition duration-200 hover:bg-gray-300">
                                <HiChatBubbleBottomCenterText className="h-6 w-6" />
                                <span className="ml-3">Withdraw</span>
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
            {berlangsungBottomModal()}
        </Fragment>
    );
}

export default SellerDashboard;