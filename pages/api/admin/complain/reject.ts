import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../lib/prisma"
import { ComplainStatus, NotifRole, NotifType, OrderStatus } from '@prisma/client'

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
          OrderStatus: OrderStatus.RETURN_REJECTED,
          Complain:{
            update:{
              status: ComplainStatus.CLOSED
            }
          }
      }
  });

  const transaction = await prisma.transaction.findFirst({
    where: {id: order.transactionId}
  })
  
  const notificationUser = await prisma.notification.create({
    data:{
      userId: transaction?.userId!,
      notifRole: NotifRole.USER,
      notifType: NotifType.TRANSACTION,
      body: `Permintaan pengembalian barang untuk transaksi ${transaction?.id} telah ditolak admin.`
    }
  });

  const shop = await prisma.shop.findFirst({
    where: {id: transaction?.shopId!}
  })
  
  const notificationSeller = await prisma.notification.create({
    data:{
      userId: shop?.userId!,
      notifRole: NotifRole.SELLER,
      notifType: NotifType.TRANSACTION,
      body: `Permintaan pengembalian barang untuk transaksi ${transaction?.id} telah ditolak admin.`
    }
  });

  res.status(200).json({ message: "Success!" })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}