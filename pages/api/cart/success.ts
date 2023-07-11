import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { NotifRole, NotifType, TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id, paymentType} = req.body
  const session = await getSession({req})  

  try {
    const transaction = await prisma.transaction.update({
        where:{id: id!},
        data:{
            status: TransactionStatus.AWAITING_CONFIRMATION,
            paymentMethod: String(paymentType)
        }
    })

    const shop = await prisma.shop.findFirst({
      where: {id: transaction.shopId}
    })

    const notificationUser = await prisma.notification.create({
      data:{
        userId: session?.user.id!,
        notifRole: NotifRole.USER,
        notifType: NotifType.TRANSACTION,
        body: `Pembayaran untuk transaksi ${transaction.id} telah berhasil.`
      }
    })

    const notificationSeller = await prisma.notification.create({
      data:{
        userId: shop?.userId!,
        notifRole: NotifRole.SELLER,
        notifType: NotifType.TRANSACTION,
        body: `Transaksi baru dengan kode ${transaction.id} telah dibuat.`
      }
    })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}