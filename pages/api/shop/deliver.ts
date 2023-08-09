import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { NotifRole, NotifType, TransactionStatus } from '@prisma/client'

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

    const transaction = await prisma.transaction.update({
        where:{id: id},
        data:{
            status: TransactionStatus.PACKING,
            updatedAt: new Date()
        }
    });
    
    const notificationUser = await prisma.notification.create({
      data:{
        userId: transaction.userId,
        notifRole: NotifRole.USER,
        notifType: NotifType.TRANSACTION,
        body: `Transaksi ${transaction.id} telah diproses penjual.`
      }
    })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}