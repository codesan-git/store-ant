import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { NotifRole, NotifType, OrderStatus, TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})
  
  const oldTransaction = await prisma.transaction.findFirst({
    where: {id: id},
    include:{
      order: true
    }
  });

  const transaction = await prisma.transaction.update({
    where: {id: id},
    data: {
      status: TransactionStatus.CANCELED
    }
  });
  
  oldTransaction?.order.forEach(async (order) => {
    const product = await prisma.product.findFirst({
      where:{id: Number(order?.productId)}
    })
  
    if(oldTransaction?.status != TransactionStatus.UNPAID){
      const returnAmount: number = Number(order?.count) * Number(product?.price);
        
      const user = await prisma.user.findFirst({
          where:{id: oldTransaction.userId}
      });
  
      const userUpdate = await prisma.user.update({
          where: {id: user?.id},
          data:{
              balance: Number(user?.balance) + returnAmount
          }
      });  
    }

    const orderUpdate = await prisma.order.update({
      where: {id: order.id},
      data: {
        OrderStatus: OrderStatus.CANCELLED
      }
    });
    
    const productUpdate = await prisma.product.update({
      where:{id: Number(product?.id)},
      data:{
          stock: Number(Number(product?.stock) + Number(order.count))
      }
    });   
  });
  
  const notificationUser = await prisma.notification.create({
    data:{
      userId: oldTransaction?.userId!,
      notifRole: NotifRole.USER,
      notifType: NotifType.TRANSACTION,
      body: `Transaksi ${oldTransaction?.id!} berhasil dibatalkan.`
    }
  })

  res.status(200).json({ message: "Success!" })
}