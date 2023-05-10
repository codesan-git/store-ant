import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { signIn, signOut, getSession } from 'next-auth/react'

export default function Home({session}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs</title>
        <meta name="description" content="Nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!session && (
          <>
            <h1>
              Nextjs
            </h1>
            <h2 className={styles.subheader}>
              You're not logged in
            </h2>
            <br />
            <button onClick={() => signIn("google")}>Sign In</button>
          </>
        )}
        {session && (
          <>
            <h1>
              Dashboard
            </h1>
            <h2 className={styles.subheader}>
              Signed in as {session.user.email}
            </h2>
            <br />
            <button onClick={signOut}>Sign Out</button>
          </>
        )}
      </main>
    </div>
  )
}


export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  return {
    props: { session },
  }
}]