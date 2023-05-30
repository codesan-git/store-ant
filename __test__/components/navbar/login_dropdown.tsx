import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
  session: Session
  onLogoutClick: () => Promise<void>, //if you want to pass an async function, use Promise<T>
}

const LoginDropdown = ({session, onLogoutClick}: Props) => {



  return (
    <Fragment>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar mr-3">
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
              <h1 className="text-sm flex-1 text-right">Rp.30.000,00</h1>
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
    </Fragment>
  );
}

export default LoginDropdown;