import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { TransactionStatus, OrderStatus, NotifRole, NotifType } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  try {
    const orderData = await prisma.order.findFirst({
        where: {id: Number(id)}
    })  

    const order = await prisma.order.update({
        where:{id: Number(id)},
        data:{
            OrderStatus: OrderStatus.RETURNED
        }
    })

    const product = await prisma.product.findFirst({
      where:{id: Number(orderData?.productId)}
    })

    const productUpdate = await prisma.product.update({
      where:{id: Number(product?.id)},
      data:{
        stock: Number(Number(product?.stock) + Number(orderData?.count))
      }
    })    

    const returnAmount: number = Number(orderData?.count) * Number(product?.price);
    
    const user = await prisma.user.findFirst({
        where:{id: session?.user?.id}
    });

    const userUpdate = await prisma.user.update({
        where: {id: user?.id},
        data:{
            balance: Number(user?.balance) + returnAmount
        }
    });

    const transaction = await prisma.transaction.update({
      where: {id: orderData?.transactionId},
      data: {
        status: TransactionStatus.REFUNDED,
        updatedAt: new Date()
      }
    });
    
    const notificationUser = await prisma.notification.create({
      data:{
        userId: transaction.userId,
        notifRole: NotifRole.USER,
        notifType: NotifType.TRANSACTION,
        body: `Permintaan pengembalian barang untuk transaksi ${transaction.id} telah disetujui.`
      }
    });

    res.status(200).json({ message: "Success!" })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}