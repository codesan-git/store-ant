// _app.tsx

import { Session } from "next-auth"
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import "../styles/globals.css"
// import 'primereact/resources/themes/saga-blue/theme.css';
// import "primereact/resources/themes/soho-light/theme.css";
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

const App = ({ 
  Component, pageProps 
  }: AppProps <{
  session: Session;
  }>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;