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
  const { password,email, access_token:token } = req.body;

  console.log("password", password);
  console.log('email reset', email)
  console.log('tokenGan', token)

  const account = await prisma.account.findFirst({
    where: {access_token:token}
  })
  const user = await prisma.user.findFirst({
    where: {id:account?.userId}
  })

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.profile.upsert({
        where: { userId: user?.id! },
        update: {
          password: hashedPassword,
        },
        create: {
          userId: user?.id!,
          password: hashedPassword,
          username:''
        },
        // data: {
        //   password: hashedPassword,
        // },
      });
      res.status(200).json({ message: "password changed" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Fail" });
  }

  // try {
  //   if (email) {
  //     const hashedPassword = await bcrypt.hash(password, 12);
  //     await prisma.profile.update({
  //       where: { userId: session?.user?.id! },
  //       data: {
  //         password: hashedPassword,
  //       },
  //     });
  //     res.status(200).json({ message: "password changed" });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json({ message: "Fail" });
  // }
}
