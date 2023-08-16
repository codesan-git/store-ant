import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const session = await getSession({ req });

  const successDelete = await prisma.bankAccount.delete({
    where: {
      userId: session?.user.id!
    }
  })

  //console.log("delete bank");

  res.status(200).json({message: 'success delete'});

  // try {
  // } catch (error) {
  //   // //console.log("erorr ", error);
  // }
}