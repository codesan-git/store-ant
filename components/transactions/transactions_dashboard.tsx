import Link from "next/link";
import { Fragment, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

const TransactionsDashboard = () => {

  const [berlangsungIsOpen, setBerlangsungIsOpen] = useState<Boolean>(false);

  const onBerlangsungClicked = () => {
    setBerlangsungIsOpen(!berlangsungIsOpen);
  }

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
            <li>
              <button className="flex justify-center items-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300" onClick={onBerlangsungClicked}>
                <span className="mr-1">
                  Berlangsung
                </span>
                {berlangsungIsOpen ? <HiChevronUp className="h-6 w-6"/> : <HiChevronDown className="h-6 w-6"/>}
              </button>
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
      </div>
    </Fragment>
  );
}

export default TransactionsDashboard;