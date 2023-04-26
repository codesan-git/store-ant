import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from 'next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client'
import { prisma } from "../../../lib/prisma"
import { compare } from "bcrypt";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
const authOptions : NextAuthOptions = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
          id: "credentials",
          name: "credentials",
          credentials: {
            email: {
              label: "Email",
              type: "text",
            },
            password: {
              label: "Password",
              type: "password",
            },
          },
          async authorize(credentials) {
            // Find user with the email
            const user = await prisma.user.findUnique({
              where:{
                email: credentials?.email
              }
            });

            // Email Not found
            if (!user) {
              throw new Error("Email is not registered");
            }

            const profile = await prisma.profile.findUnique({
              where:{
                userId: user?.id
              }
            });    
    
            // Check hased password with DB hashed password
            const isPasswordCorrect = await compare(
              credentials?.password!,
              profile?.password!
            )
    
            // Incorrect password
            if (!isPasswordCorrect) {
              throw new Error("Password is incorrect");
            }
    
            return user;
          },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
    session: {strategy: "jwt", maxAge: 3 * 60 * 60},
    // session: {strategy: "jwt", maxAge: 10},
    jwt:{
      secret: process.env.JWT_SECRET,
      maxAge: 3 * 60 * 60
      // maxAge: 10
    },
    callbacks: {
      async jwt({ token, account, user }) {
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (account) {
          token.accessToken = account.access_token
          token.id = user?.id
        }
        return token
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token and user id from a provider.
        session.user.accessToken = token.accessToken as string
        session.user.id = token.id as string
        const userData = await prisma.user.findUnique({
          where: {id: session.user.id}
        })
        if(userData?.image?.includes("images\\profiles")){
          session.user.image = `http:\\\\localhost:3000\\${userData.image}`;
        }else{
          session.user.image = userData?.image;
        }
        session.user.emailVerified = userData?.emailVerified!;
        return session
      }
    },
};