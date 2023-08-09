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
  const { password,email, access_token:token, phoneNumber } = req.body;

  //console.log("password", password);
  //console.log('email reset', email)
  //console.log('tokenGan', token)

  const account = await prisma.account.findFirst({
    where: {access_token:token}
  })
  const user = await prisma.user.findFirst({
    where: {id:account?.userId}
  })
  
  try {
    if (phoneNumber){

        await prisma.profile.update({
            where: { userId: user?.id! },
            data: {
                phoneNumber: phoneNumber,
            },
            });
        }
      res.status(200).json({ message: "Phone Number Changed" });
    // }
  } catch (error) {
    //console.log(error);
    res.status(400).json({ message: "Fail" });
  }
}
