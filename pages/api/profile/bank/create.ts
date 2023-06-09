import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bankId, name, number } = req.body;
  console.log(bankId, name, number);

  try {
    const session = await getSession({ req });
    
    const bankAccount = await prisma.bankAccount.create({
        data:{
            bankTypeId: Number(bankId),
            userId: session?.user.id!,
            name: name,
            number: number
        }
    })
    res.status(200).json({bankAccount: bankAccount});
  } catch (error) {
    console.log("erorr ", error);
  }
}
