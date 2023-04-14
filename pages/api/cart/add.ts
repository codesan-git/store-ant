import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {count, productId} = req.body
  const session = await getSession({req})
  console.log("PRODUCT ID = ", productId);
  console.log("COUNT = ", count);

  try {
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

    const productInCart = await prisma.productInCart.create({
        data:{
            cartId: cart.id,
            productId: Number(productId),
            count: Number(count)
        }
    })

    const product = await prisma.product.findFirst({
        where:{id: productId},
        select: {
            stock: true
        }
    })

    await prisma.product.update({
        where: {id: productId},
        data:{
            stock: (product?.stock! - Number(count))
        }
    })
    res.status(200).json({ productInCart })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}