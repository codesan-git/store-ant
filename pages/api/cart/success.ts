import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})  

  try {
    let transaction = await prisma.transaction.findFirst({
      where: {id: id}
    });

    const productInCart = await prisma.productInCart.update({
        where:{id: Number(transaction?.productInCartId)},
        data:{
            status: Status.AWAITING_CONFIRMATION
        }
    })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}