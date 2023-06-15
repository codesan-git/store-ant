import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status, TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})
  
  const oldProductInCart = await prisma.productInCart.findFirst({
    where: {id: Number(id)}
  })
  
  const product = await prisma.product.findFirst({
    where:{id: Number(oldProductInCart?.productId)}
  })

  if(oldProductInCart?.status != Status.UNPAID){
    const returnAmount: number = Number(oldProductInCart?.count) * Number(product?.price);
      
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
      where: {productInCartId: Number(id)},
      data: {
        status: TransactionStatus.REFUNDED
      }
    })
  }

  const productInCart = await prisma.productInCart.update({
      where:{id: Number(id)},
      data:{
          status: Status.CANCELED
      }
  })

  const productUpdate = await prisma.product.update({
    where:{id: Number(product?.id)},
    data:{
        stock: Number(Number(product?.stock) + Number(productInCart.count))
    }
  })   

  res.status(200).json({ message: "Success!" })
}