import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from 'next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client'
import { prisma } from "../../../lib/prisma"

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
const authOptions = {
    providers: [
        GoogleProvider({
          clientId: "327099314916-uk7nkoa3ngqsrpgbii4m5pj057rqab2t.apps.googleusercontent.com",
          clientSecret: "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"
        })
      //   CredentialsProvider({
      //     id: "credentials",
      //     name: "credentials",
      //     credentials: {},
      //     async authorize(credentials : any) {
      //         try
      //         {
      //             const user = await prisma.user.findFirst({
      //                 where: {
      //                     email: credentials.email
      //                 }
      //             });

      //             const profile = await prisma.profile.findFirst({
      //               where: {
      //                   userId: user?.id
      //               }
      //             });

      //             if (user !== null)
      //             {
      //                 //Compare the hash
      //                 //const res = await confirmPasswordHash(credentials.password, user.password);
      //                 if (credentials.password === profile?.password)
      //                 {
      //                     const userAccount = {
      //                         userId: user.id,
      //                         name: user.name,
      //                         usernamme: profile?.username,
      //                         email: user.email
      //                     };
      //                     return userAccount;
      //                 }
      //                 else
      //                 {
      //                     console.log("Credentials not matched");
      //                     return null;
      //                 }
      //             }
      //             else {
      //                 return null;
      //             }
      //         }
      //         catch (err)
      //         {
      //             console.log("Authorize error:", err);
      //         }

      //     }
      // })
    ],
    adapter: PrismaAdapter(new PrismaClient()),
    secret: process.env.SECRET,
    // callbacks: {
    //   session: async ({ session, token } : any) => {
    //     if (session?.user) {
    //       session.user.id = token.uid;
    //     }
    //     return session;
    //   },
    //   jwt: async ({ user, token } : any) => {
    //     if (user) {
    //       token.uid = user.id;
    //     }
    //     return token;
    //   }
    // }
};