import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const findEmail = await prisma.user.findUnique({
      where: { email: email },
      
    });
    if(!findEmail){
        res.status(400).json("email not found")
    }
    res.status(200).json( findEmail?.email );
} catch (error) {
    console.log(error);
    res.status(400).json({ message: "Fail" });
  }
}
