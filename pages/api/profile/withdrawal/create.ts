import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount } = req.body;

  try {
    const session = await getSession({ req });

    const withdrawal = await prisma.withdrawal.create({
      data:{
        userId: session?.user.id!,
        amount: Number(amount)
      }
    })

    const user = await prisma.user.update({
      where: {id: session?.user.id!},
      data:{
        balance: Number(session?.user.balance) - Number(amount)
      }
    })
    
    res.status(200).json({bankAccount: withdrawal});
  } catch (error) {
    console.log("erorr ", error);
  }
}
