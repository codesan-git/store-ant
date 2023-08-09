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

  try {
    const transaction = await prisma.transaction.updateMany({
        where:{id: id!, userId: session?.user?.id!},
        data:{
            status: TransactionStatus.CANCELING,
            updatedAt: new Date()
        }
    })
    res.status(200).json({ message: "Success!" })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}