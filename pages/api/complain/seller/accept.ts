import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../lib/prisma"
import { ComplainStatus, OrderStatus, TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  // const session = await getSession({req})

  const orderData = await prisma.order.findFirst({
      where:{id: Number(id)}
  })  

  const order = await prisma.order.update({
      where:{id: Number(id)},
      data:{
          OrderStatus: OrderStatus.RETURNED,
          Complain:{
            update:{
              status:ComplainStatus.CLOSED
            }
          }
      }
  })  
  res.status(200).json({ message: "Success!" })
}