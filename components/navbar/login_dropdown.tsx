import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useState } from "react";

interface Props {
  session: Session
  onLogoutClick: () => Promise<void>, //if you want to pass an async function, use Promise<T>
}

const LoginDropdown = ({session, onLogoutClick}: Props) => {

  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  //TODO: bugfix for dropdown logic. Bug occurs when you enter web-view mode, click on the dropdown, then click anywhere to close dropdown, then change to mobile-view mode
  // The modal is still open even though we close the dropdown in web-view mode. This is because we don't have a handler that would set the Dropdown closed when we click elsewhere

  return (
    <Fragment>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar mr-3" onClick={() => setDropdownOpen(true)}>
          <div className="w-10 rounded-full">
            <img src={session?.user?.image!} />
          </div>
        </label>
        <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
          <div id="mini-profile-dropdown" className="flex flex-col justify-center items-center space-y-2 p-2">
            <div className="avatar w-10">
              <img src={session?.user?.image!}  className="rounded-full" />
            </div>
            <h1 className="text-sm text-center">{session.user.name}</h1>
          </div>
          <div id="finance-details" className="px-4 py-2 border-y border-y-gray-400">
            <div className="flex flex-row">
              <h1 className="text-sm">Saldo</h1>
              <h1 className="text-sm flex-1 text-right">{formatter.format(session.user.balance)}</h1>
              </div>
          </div>
          <li className="mt-1">
            <Link className="justify-between" 
              href={{ 
                pathname: "/profile",
            }}>
              Profil
            </Link>
          </li>
          <li>
            <Link href={{
              pathname: "/shop",
            }}>
              Toko
            </Link>
          </li>
          <li>
            <Link href={{
              pathname: "/transactions"
            }}>
              Pesanan saya
            </Link>
          </li>
          <li>
            <button onClick={onLogoutClick}>Logout</button>
          </li>
        </ul>
      </div>
      <div hidden={!dropdownOpen.valueOf()} id="menu-menu-modal" className="lg:hidden p-4 bg-white space-y-2 fixed w-full h-full top-0 right-0 left-0 bottom-0 z-50">
        <div id="main-menu-modal-x-container" className="flex flex-row space-x-2">
          <button onClick={() => setDropdownOpen(false)} className="font-bold text-2xl">✕</button>
          <h1 className="font-bold text-2xl">Menu utama</h1>
        </div>
        <div id="main-menu-modal-content" className="">
          <div id="user-mini-profile" className="flex flex-row items-center p-2 space-x-2 bg-blue-gray-50">
            <div id="modal-profile-photo-container" className="flex align-middle">
              <div className="avatar w-10">
                <img src={session?.user?.image!}  className="rounded-full" />
              </div>
            </div>
            <div>
              <p className="truncate">{session.user.name}</p>
              <h1>Rp. Saldo</h1>
            </div>
          </div>
          <div>
            <ul>
              <li>
                <Link className="flex p-2 text-base font-normal transition duration-200 hover:bg-gray-300" href={{pathname: '/profile'}}>
                  <span>Profil</span> 
                </Link>
              </li>
              <li>
                <Link className="flex p-2 text-base font-normal transition duration-200 hover:bg-gray-300" href={{pathname: '/shop'}}>
                  <span>Toko</span> 
                </Link>
              </li>
              <li>
                <Link className="flex p-2 text-base font-normal transition duration-200 hover:bg-gray-300" href={{pathname: '/transactions'}}>
                  <span>Pembelian</span> 
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <Link className="flex p-2 text-base font-normal transition duration-200 hover:bg-gray-300" href={{pathname: '/profile'}}>
                  <span>Penarikan Dana</span> 
                </Link>
              </li>
              <li>
                <Link className="flex p-2 text-base font-normal transition duration-200 hover:bg-gray-300" href={{pathname: '/profile'}}>
                  <span>Pusat Bantuan</span> 
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="">
          <button onClick={onLogoutClick} className="p-2 w-28 transition duration-200 hover:bg-gray-300">Logout</button>
        </div>
      </div>
    </Fragment>
  );
}

export default LoginDropdown;