import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})
  
  try {
    let cart = await prisma.cart.findFirst({
      where: {userId: session?.user.id}
    });

    if(!cart){
        res.status(200).json({ }) 
    }

    const productInCart = await prisma.productInCart.findMany({
        where:{cartId: cart?.id, status: Status.INCART},
        select:{
            id: true,
            product: true,
            count: true
        }
    })

    res.status(200).json({productInCart})
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}