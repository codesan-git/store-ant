import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

// type Data = {
//   message: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password, phonenumber } = req.body;

  try {
    const session = await getSession({ req });
    const userId = session;
    const findUser = await prisma.profile.findUnique({
      where: { userId:session?.user.id },
    });
    console.log("kocak", findUser);
    console.log("userId", userId);
    res.status(200).json({
      id: findUser,
    });
  } catch (error) {
    console.log("erorr update", error);
  }
}
