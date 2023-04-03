import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../lib/prisma"

async function handleGoogleSignOut() {
  signOut({callbackUrl: "http://localhost:3000/login"})
}

interface Products {
  products:{
    id: string,
    name: string,
    price: number,
    stock: number
  }[]
}

export default function Home({products} : Products) {
  const{data:session} = useSession()
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  return (
    <>
        <Head>
          <title>Homepage</title>
        </Head>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 navbar">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl text-gray-100">Store.ant</a>
            <input type="text" placeholder="Shop now" className="input input-bordered input-secondary w-full mx-5 h-10" />
          </div>
          {session ? (
            <div className="flex-none">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle mr-5">
                  <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="badge badge-sm indicator-item">8</span>
                  </div>
                </label>
                <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                  <div className="card-body">
                    <span className="font-bold text-lg">8 Items</span>
                    <span className="text-info">Subtotal: $999</span>
                    <div className="card-actions">
                      <button className="btn btn-primary btn-block">View cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar mr-3">
                  <div className="w-10 rounded-full">
                    <img src={session?.user?.image!}/>
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link className="justify-between" href={{pathname:'/profile', query: { email: session.user?.email }}}>
                      Profile
                      {/* <span className="badge">New</span> */}
                    </Link>
                  </li>
                  <li><Link href={{pathname:'/shop', query: { email: session.user?.email }}}>Store</Link></li>
                  <li><button onClick={handleGoogleSignOut}>Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <a className="btn btn-ghost normal-case text-md text-gray-100" href='/login'>Login</a>
          )}
        </div>
        <div>
          <div className='w-auto px-8 my-8 flex-col grid lg:grid-cols-4 gap-10'>
              {products.map(product =>(
                <div data-theme="garden" className="card w-auto glass" key={product.id}>
                  <figure><img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" alt="image!"/></figure>
                  <div className="card-body py-5 h-1/4">
                    <h2 className="card-title">{product.name}</h2>
                    <p className='text-md'>Rp. {product.price}</p>                
                    <p className='text-md'>Qty. {product.stock}</p>
                  </div>
                </div>
              ) )}
          </div>
        </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await prisma.product.findMany({
    select:{
      id: true,
      name: true,
      price: true,
      stock: true
    },
    orderBy: [
      {
        id: 'asc',
      }
    ],
  })
  return{
    props:{
      products
    }
  }
}


// update Apr 3

// type Data = { }

// export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (context) => {
//   const session = await getSession({context?.req})

//   return {
//     props: {
//       data,
//     },
//   }
// }

// function Guest(){
//   return(
//     <main className='container mx-auto text-center py-20'>
//       <h3 className='text-4xl font-bold'>
//         Guest Homepage
//       </h3>
//       <div className='flex justify-center'>
//         <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/login'}>Sign In</Link>
//       </div>
//     </main>
//   )
// }

// function User({user}: {user : DefaultSession["user"]}){
//   return(
//     <main className='container mx-auto text-center py-20'>
//       <h3 className='text-4xl font-bold'>
//         User Homepage
//       </h3>
//       <div className='details'>
//         <h5>{user?.name}</h5>
//         <h5>{user?.email}</h5>
//       </div>
//       <div className="flex justify-center">
//         <button className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 bg-gray-50'>Sign Out</button>
//       </div>
//       <div className='flex justify-center'>
//         <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/profile'}>profile</Link>
//       </div>
//     </main>
//   )
// }