import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {shopname, address, image} = req.body
  const session = await getSession({req})

  try {
    // // // CREATE
    await prisma.shop.upsert({
      where: {userId: session?.user?.id},
      create: {
        userId: session?.user?.id!,
        shopName: shopname,
        image: image
      },
      update: {
        shopName: shopname,
        image: image
      }
    })
    res.status(200).json({ message: 'Shop created' })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}