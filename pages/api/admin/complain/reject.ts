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

    const order = await prisma.order.update({
      where:{id: Number(id)},
      data:{
          OrderStatus: OrderStatus.RETURN_REJECTED
      }
  })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}