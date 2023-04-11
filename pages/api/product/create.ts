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
  const {name, price, stock, categoryId } = req.body
  const session = await getSession({req})
  const shop = await prisma.shop.findUnique({
    where: {
      userId: session?.user?.id
    },
  })

  try {
    // // // CREATE
    await prisma.product.create({
      data: {
        shopId: shop?.id!,
        categoryId: Number(categoryId),
        name: name,
        price: parseInt(price),
        stock: parseInt(stock)
      }
    })
    res.status(200).json({ message: 'product created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}