import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

async function handleGoogleSignOut() {
  signOut({callbackUrl: "http://localhost:3000/login"})
}

export default function Home() {
  const{data:session} = useSession()
  if(session){
    //console.log(session.user)
    return (
      <>
        <Head>
          <title>Homepage</title>
        </Head>
        <main className='container mx-auto text-center py-20'>
          <h3 className='text-4xl font-bold'>
            User Homepage
          </h3>
          <div className='details'>
            <h5>{session?.user?.name}</h5>
            <h5>{session?.user?.email}</h5>
          </div>
          <div className="flex justify-center">
            <button onClick={handleGoogleSignOut} className='mt-5 px-10 py-1 rounded-sm bg-gray-50'>Sign Out</button>
          </div>
          <div className='flex justify-center'>
            <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={{pathname:'/profile', query: { email: session.user?.email }}}>Profile</Link>
          </div>
          <div className='flex justify-center'>
            <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/shop/register'}>Start as a Seller</Link>
          </div>
          <div className='flex justify-center'>
            <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/product'}>Products</Link>
          </div>
        </main>
      </>
    )
  }else{
    //redirect('http://localhost:3000/login')
    return(
      <>
      <Head>
        <title>Homepage</title>
      </Head>
      <main className='container mx-auto text-center py-20'>
        <h3 className='text-4xl font-bold'>
          Guest Homepage
        </h3>
        <div className='flex justify-center'>
          <Link className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50' href={'/login'}>Sign In</Link>
        </div>
      </main>
      </>
    )
  }
}

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