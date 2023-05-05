import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {count, productId, productCount} = req.body
  const session = await getSession({req})
  console.log("PRODUCT ID = ", productId);
  console.log("COUNT = ", count);

  let cart = await prisma.cart.findFirst({
    where: {userId: session?.user.id}
  });

  if(!cart){
      cart = await prisma.cart.create({
          data:{
              userId: session?.user.id!
          }
      })
  }

  const existingData = await prisma.productInCart.findFirst({
    where:{productId: productId, cartId: cart.id, status: Status.INCART}
  })
  console.log("DATA: ", existingData);

  if(existingData){
    const productInCart = await prisma.productInCart.update({
      where:{id: existingData.id},
      data:{count: existingData.count + Number(count)}
    })
    console.log("UPDATE: ", productInCart);
  }else{
    const productInCart = await prisma.productInCart.create({
      data:{
          cartId: cart.id,
          productId: Number(productId),
          count: Number(count)
      },
    })
    console.log("insert: ", productInCart);
  }

  await prisma.product.update({
      where: {id: productId},
      data:{
          stock: Number(productCount)
      }
  })
  res.status(200).json({ message: "Success" })

  // try {
  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}