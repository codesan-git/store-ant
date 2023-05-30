import Link from "next/link";
import { Fragment } from "react";

const TransactionsDashboard = () => {

  return (
    <Fragment>
      <div id="transactions-dashboard" className="">
        <div id="title-container" className="hidden lg:block">
          <h1 className="text-4xl">Pembelian</h1>
        </div>
        <div id="transactions-dashboard-navigation" className="w-auto">
          <ul className="flex flex-row lg:flex-col lg:h-96 w-auto space-x-4 overflow-x-auto">
            <li>
              <Link href={'/'} className="flex justify-center items-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300"> {/*TODO: reduce centering classnames*/}
                <div className="flex justify-center items-center text-center">
                  Menungggu Pembayaran
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/'} className="flex justify-center items-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                <div className="flex justify-center items-center text-center">
                  Berlangsung
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/'} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
                <div className="flex justify-center items-center text-center">
                  Berhasil
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/'} className="flex justify-center text-center p-1 w-32 h-12 text-sm font-normal rounded-sm bg-gray-300">
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