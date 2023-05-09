import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {cartId, star, comment} = req.body;
  let avgRating = 0, ratingTotal = 0;

  try {
    const rating = await prisma.rating.upsert({
        where:{productInCartId: cartId},
        create:{
            productInCartId: cartId,
            rate: Number(star),
            comment: comment
        },
        update:{
            rate: Number(star),
            comment: comment
        }
    })

    const productInCart = await prisma.productInCart.findFirst({
        where: {id: cartId}
    })

    const product = await prisma.product.findFirst({
        where:{id: productInCart?.productId}
    })
    
    const ratings = await prisma.rating.findMany({
        where:{
            productInCart:{
                product:{
                    shopId: product?.shopId
                }
            }
        }
    })

    let i;
    for(i = 0; i < ratings?.length; i++){
        ratingTotal += ratings[i].rate;
    }
    avgRating = ratingTotal / ratings?.length;

    const shop = await prisma.shop.update({
        where:{id: product?.shopId},
        data:{
            averageRating: avgRating
        }
    })

    res.status(200).json({ rating: rating })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}