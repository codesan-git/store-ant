import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// _app.tsx
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";
import { AppProps } from "next/app";
import "../styles/globals.css";
import Script from "next/script";

const App = ({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBipwInjazG5CwsxyzJERjCy5R9bBaISII",
    authDomain: "storeant.firebaseapp.com",
    projectId: "storeant",
    storageBucket: "storeant.appspot.com",
    messagingSenderId: "945696756215",
    appId: "1:945696756215:web:1f74d34f62d1c640311ef2",
    measurementId: "G-E22DXYR0LM"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);

  // useEffect(() => {
  //   TagManager.initialize({ gtmId: 'GTM-KFR823HK' });
  // }, []);

  return (
    <>
      <Script 
        strategy="lazyOnload" 
        src={`https://www.googletagmanager.com/gtag/js?id=G-E22DXYR0LM`}
      />
      {/* <Script strategy="lazyOnload">
        {
          `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-E22DXYR0LM');`
        }
      </Script> */}

      <NextIntlProvider locale="en" timeZone="Asia/Bangkok">
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </NextIntlProvider>
    </>
  );
};

export default App;