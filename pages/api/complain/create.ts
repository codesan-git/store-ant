import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"
import { OrderStatus } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {image, orderId, description} = req.body;
    const session = await getSession({req});
    (orderId as string).split(",").forEach( async (id:string) => {
        const order = await prisma.order.update({
            where: {
                id: Number(id)
            },
            data:{
                OrderStatus: OrderStatus.RETURNING
            }
        })
        const complain = await prisma.complain.create({
            data: {
                orderId: Number(id),
                description: description as string,
                image: imageUrl.join(",")
                // image: image as string
            }
        })
    })

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
      imageUrl.push("");
    }
    
    console.log((orderId as string).split(","))
    res.status(200).json({ message: 'complain created' });
    try {
        // // // // CREATE
        // const complain = await prisma.complain.create({
        //     data: {
        //         orderId: Number(orderId),
        //         description: description as string,
        //         image: imageUrl.join(",")
        //         // image: image as string
        //     }
        // })
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};