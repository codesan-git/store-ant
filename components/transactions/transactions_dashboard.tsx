import Link from "next/link";
import { Fragment, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

const TransactionsDashboard = () => {

  const [berlangsungIsOpen, setBerlangsungIsOpen] = useState<Boolean>(false);

  const onBerlangsungClicked = () => {
    setBerlangsungIsOpen(!berlangsungIsOpen);
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
  return (
    <Fragment>
      <div id="transactions-dashboard" className="">
        <div id="title-container" className="hidden lg:block">
          <h1 className="text-4xl">Pembelian</h1>
        </div>
        <div id="transactions-dashboard-navigation" className="w-auto">
          <ul className="flex flex-row lg:flex-col lg:h-96 w-auto space-x-2 overflow-x-auto">
            <li>
              <Link href={''} className="flex justify-center items-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300"> {/*TODO: reduce centering classnames*/}
                <div className="flex justify-center items-center text-center">
                  Menungggu Pembayaran
                </div>
              </Link>
            </li>
            <li id="berlangsung-mobile-version" className="sm:hidden">
              <label htmlFor="berlangsung-modal" className="flex justify-center items-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300 hover:cursor-pointer">Berlangsung</label>
            </li>
            <li id="berlangsung-web-version" className="hidden sm:block">
              <button className="flex justify-center items-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300" onClick={onBerlangsungClicked}>
                <span className="mr-1">
                  Berlangsung
                </span>
                {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6"/> : <HiChevronDown className="h-6 w-6"/>}
              </button>
              <ul hidden={!berlangsungIsOpen.valueOf()}>
                <li>
                  <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                    <div className="flex justify-center items-center text-center">
                      Menunggu Konfirmasi
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Diproses
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                    <div className="flex justify-center items-center text-center">
                      Menunggu Kurir
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Dikirim
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Tiba
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                <div className="flex justify-center items-center text-center">
                  Berhasil
                </div>
              </Link>
            </li>
            <li>
              <Link href={''} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                <div className="flex justify-center items-center text-center">
                  Tidak Berhasil
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <div id="berlangsung-modal-container">
          <input type="checkbox" id="berlangsung-modal" className="modal-toggle"/>
          <div className="modal modal-bottom">
            <div className="modal-box h-screen relative bg-gray-200">
              <label htmlFor="berlangsung-modal" className="absolute right-5 top-5 text-2xl hover:cursor-pointer">✕</label>
              <h1 className="text-xl font-bold">Berlangsung</h1>
              <ul className="">
                <li>
                  <Link href={''} className="flex p-2 h-12 text-sm font-normal">
                    <div className="flex justify-center items-center text-center">
                      Menunggu Konfirmasi
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex p-2 h-12 text-sm font-normal">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Diproses
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex p-2 h-12 text-sm font-normal">
                    <div className="flex justify-center items-center text-center">
                      Menunggu Kurir
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex p-2 h-12 text-sm font-normal">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Dikirim
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex p-2 h-12 text-sm font-normal">
                    <div className="flex justify-center items-center text-center">
                      Pesanan Tiba
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TransactionsDashboard;