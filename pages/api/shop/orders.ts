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
    
    const productInCart = await prisma.productInCart.findMany({
        where:{
            product: {shopId: shop?.id!},
        },
        select:{
            id: true,
            productId: true,
            count: true,
            status: true
        }
    })

    res.status(200).json({productInCart})
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}