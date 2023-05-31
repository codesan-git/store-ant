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
      <div id="transactions-dashboard" className="lg:shadow-md lg:w-1/6 bg-none lg:bg-gray-400">
        <div id="title-container" className="hidden lg:block pt-4 px-4">
          <h1 className="text-3xl">Pembelian</h1>
        </div>
        <div id="transactions-dashboard-navigation" className="">
          <ul className="flex flex-row lg:flex-col lg:h-auto space-x-2 lg:space-x-0 overflow-x-auto lg:overflow-visible ">
            <li>
              <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300"> {/*TODO: reduce centering classnames*/}
                <span className="flex justify-center items-center text-center">
                  Menungggu Pembayaran
                </span>
              </Link>
            </li>
            <li id="berlangsung-web-version" className="">
              <button className="flex justify-center lg:justify-start items-center text-center p-2 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300" onClick={onBerlangsungClicked}>
                <span className="flex-1 text-left ml-1 lg:ml-0">
                  Berlangsung
                </span>
                {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6"/> : <HiChevronDown className="h-6 w-6"/>}
              </button>
              <ul hidden={!berlangsungIsOpen.valueOf()} className="bg-gray-400">
                <li>
                  <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300">
                    <span className="flex justify-center items-center text-center lg:pl-6">
                      Menunggu Konfirmasi
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300">
                    <div className="flex justify-center items-center text-center lg:pl-6">
                      Pesanan Diproses
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300">
                    <div className="flex justify-center items-center text-center lg:pl-6">
                      Menunggu Kurir
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300">
                    <div className="flex justify-center items-center text-center lg:pl-6">
                      Pesanan Dikirim
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={''} className="flex justify-center lg:justify-start p-1 lg:p-4 w-32 lg:w-auto h-12 text-sm font-normal rounded-sm lg:rounded-none hover:bg-gray-300 transition duration-300">
                    <div className="flex justify-center items-center text-center lg:pl-6">
                      Pesanan Tiba
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href={''} className="flex justify-center lg:justify-start items-center text-center p-1 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300">
                <span className="flex justify-center items-center text-center">
                  Berhasil
                </span>
              </Link>
            </li>
            <li>
              <Link href={''} className="flex justify-center lg:justify-start items-center text-center p-1 lg:p-4 w-32 lg:w-full h-12 text-sm font-normal rounded-sm lg:rounded-none bg-gray-400 hover:bg-gray-300 transition duration-300">
                <span className="flex justify-center items-center text-center">
                  Tidak Berhasil
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default TransactionsDashboard;