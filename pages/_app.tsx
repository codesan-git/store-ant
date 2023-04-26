// _app.tsx

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";
import { AppProps } from "next/app";
import "../styles/globals.css";

const App = ({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) => {
  return (
    <NextIntlProvider locale="en" timeZone="Asia/Bangkok">
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </NextIntlProvider>
  );
};

export default App;
