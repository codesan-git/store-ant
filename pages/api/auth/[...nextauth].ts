import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { NextApiHandler } from 'next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
const authOptions = {
    providers: [
        GoogleProvider({
          clientId: "327099314916-uk7nkoa3ngqsrpgbii4m5pj057rqab2t.apps.googleusercontent.com",
          clientSecret: "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"
        })
    ],
    adapter: PrismaAdapter(new PrismaClient()),
    secret: process.env.SECRET,
    // callbacks: {
    //   async session({ session, token, user }) {
    //     session.user.id = token.id;
    //     session.accessToken = token.accessToken;
    //     return session;
    //   },
    //   async jwt({ token, user, account, profile, isNewUser }) {
    //     if (user) {
    //       token.id = user.id;
    //     }
    //     if (account) {
    //       token.accessToken = account.access_token;
    //     }
    //     return token;
    //   },
    // }
};