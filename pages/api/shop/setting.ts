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
  const {shopname, address} = req.body
  const session = await getSession({req})
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  })

  try {
    // // // CREATE
    await prisma.shop.upsert({
      where: {userId: user?.id},
      create: {
        userId: user?.id!,
        shopName: shopname
      },
      update: {
        shopName: shopname
      }
    })
    res.status(200).json({ message: 'Shop created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}