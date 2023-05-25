import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../lib/prisma"
import { Status } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  const productInCart = await prisma.productInCart.update({
      where:{id: Number(id)},
      data:{
          status: Status.RETURNED
      }
  })
  res.status(200).json({ message: "Success!" })

  // try {
  //   let cart = await prisma.cart.findFirst({
  //     where: {userId: session?.user.id}
  //   });

  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}