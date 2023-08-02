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

  console.log(`ini id`, id)

  const transaction = await prisma.transaction.update({
      where:{id: String(id)},
      data:{
          status: TransactionStatus.FINISHED
      }
  })

  const shop = await prisma.shop.findFirst({
    where: {id: transaction?.shopId}
  })

  const transactionData = await prisma.transaction.findFirst({
    where: {id: id!},
    select: {
      order:{
        select:{
          product: true,
          count: true
        }
      }
    }
  });

  let totalPrice = 0;
  let i: number;

  for(i = 0; i < transactionData?.order?.length!; i++){
    totalPrice += (transactionData?.order[i]?.product?.price! * transactionData?.order[i]?.count!);
  }

  const shopUpdate = await prisma.shop.update({
    where: {id: shop?.id},
    data: {
      balance: Number(shop?.balance) + Number(totalPrice)
    }
  })

  res.status(200).json({ message: "Success!" })
  try {
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}