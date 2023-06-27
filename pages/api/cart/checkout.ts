import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  console.log("checkout: ", id);
  try {
    const productInCart = await prisma.productInCart.findFirst({
      where: { id: Number(id[0]) },
      select: {
        productId: true,
        count: true,
        product: {
          select: { shop: true}
        }
      }
    })

    let transaction = await prisma.transaction.create({
      data:{
        userId: session?.user.id!,
        shopId: productInCart?.product.shop.id!,
        paymentMethod: "",
        status: TransactionStatus.PAID
      }
    });

    let i: number;
    for(i=0; i < id.length; i++){
        let productInCart = await prisma.productInCart.findFirst({
            where:{id: Number(id[i])},
            select: {
              productId: true,
              count: true,
              product: {
                select: { shop: true}
              }
            }
        })
    
        let order = await prisma.order.create({
          data:{
            transactionId: transaction.id!,
            productId: productInCart?.productId!,
            count: productInCart?.count!,
          }
        })

        await prisma.productInCart.delete({
          where: {id: Number(id[i])}
        })
    }
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}