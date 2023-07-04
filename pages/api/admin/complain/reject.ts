import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../lib/prisma"
import { OrderStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  try {
    let cart = await prisma.cart.findFirst({
      where: {userId: session?.user.id}
    });

    const orderData = await prisma.order.update({
        where:{id: Number(id)}
    })  

    const order = await prisma.order.update({
        where:{id: Number(id)},
        data:{
            status: OrderStatus.RETURNED
        }
    })

    const product = await prisma.product.findFirst({
      where: {id: orderData?.productId}
    })

    const shop = await prisma.shop.findFirst({
      where: {id: product?.shopId}
    })

    const shopUpdate = await prisma.shop.update({
      where: {id: shop?.id},
      data: {
        balance: Number(shop?.balance) + (orderData?.count * Number(product?.price))
      }
    })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}