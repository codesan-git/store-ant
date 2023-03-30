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
          clientId: "327099314916-uk7nkoa3ngqsrpgbii4m5pj057rqab2t.apps.googleusercontent.com",
          clientSecret: "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"
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

            const profile = await prisma.profile.findUnique({
              where:{
                userId: user?.id
              }
            });
    
            // Email Not found
            if (!user) {
              throw new Error("Email is not registered");
            }
    
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
    session: {strategy: "jwt"},
    jwt:{
      secret: "Fpue0ZC+/K89P0CegNE6PCTcpG1dIG8i8z2A67C4Kzc="
    },
    // secret: process.env.NEXTAUTH_SECRET

    callbacks: {
      session: async ({ session, token } : any) => {
        if (session?.user) {
          session.user.id = token.uid;
        }
        return session;
      },
      jwt: async ({ user, token } : any) => {
        if (user) {
          token.uid = user.id;
        }
        return token;
      }
    }
};