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

  let i: number;
  let j: number;
  for(i=0; i < id.length; i++){
      await prisma.productInCart.delete({
        where:{id: Number(id[i])}
      })
  }
  res.status(200).json({ message: "Success!" })
  // try {
    
  // } catch (error) {
  //   ////console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}