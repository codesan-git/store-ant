import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {orderId, star, comment, image} = req.body;
    let avgRating = 0, ratingTotal = 0;

    const oldRating = await prisma.rating.findFirst({
        where: {orderId: Number(orderId)},
        select: {
          image: true
        }
    });

    let imageUrl = new Array();
    if(image){    
      if(Array.isArray(image.split(","))){
        (image as string).split(",").forEach((url) => {
            imageUrl.push(String(url));
          })
      } else{
        imageUrl.push(String(image));
      }
    }else{
      imageUrl.push(oldRating?.image);
    }

  try {
    const rating = await prisma.rating.upsert({
        where:{orderId: Number(orderId)},
        create:{
            orderId: Number(orderId),
            rate: Number(star),
            comment: comment as string,
            image: imageUrl.join(",")
        },
        update:{
            rate: Number(star),
            comment: comment as string,
            image: imageUrl.join(",")
        }
    })

    const order = await prisma.order.findFirst({
        where: {id: Number(orderId)}
    })

    const product = await prisma.product.findFirst({
        where:{id: order?.productId}
    })
    
    let ratings = await prisma.rating.findMany({
        where:{
            order:{
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

    ratings = await prisma.rating.findMany({
        where:{
            order:{
                productId: product?.id
             }
        }
    })

    i = 0; ratingTotal = 0; avgRating = 0;
    for(i = 0; i < ratings?.length; i++){
        ratingTotal += ratings[i].rate;
    }
    avgRating = ratingTotal / ratings?.length;

    const productEdit = await prisma.product.update({
        where:{id: product?.id},
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