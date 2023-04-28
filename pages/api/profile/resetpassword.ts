import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { password } = req.body;
  const session = await getSession({ req });

  console.log("password", password);
  console.log("session", session);

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.profile.update({
        where: { userId: session?.user?.id! },
        data: {
          password: hashedPassword,
        },
      });
      res.status(200).json({ message: "password changed" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Fail" });
  }
}
