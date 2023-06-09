import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

interface IUser extends DefaultUser {
  role?: Role;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends IUser {}
  interface Session {
    user: {
      id: string,
      accessToken: string,
      emailVerified: Date,
      role: Role,
      balance: number
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}