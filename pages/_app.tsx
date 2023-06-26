// _app.tsx

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { Socket } from "socket.io-client";

// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, 
//   { 
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"]
//     }
//   }
// );
// io.on('connection', (socket : Socket) => { 
//     console.log("user connected");
//     socket.on("room1", function(data:string){
//       console.log(data);
//     })
// });
// server.listen(3000);

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
