import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})

  try {
    const shop = await prisma.shop.findFirst({
        where:{userId: session?.user?.id!}
    })
    
    const transaction = await prisma.transaction.findMany({
        where:{
            shopId: shop?.id!,
        }
    })

    res.status(200).json({transaction})
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}