import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "@/lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"
import { OrderStatus } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {complainId, description, images} = req.body;
    console.log(`body`, req.body)
    const session = await getSession({req});
    
    let imageUrl = new Array();
    if(images){    
      if(Array.isArray(images.split(","))){
        (images as string).split(",").forEach((url) => {
            imageUrl.push(String(url));
        })
      } else{
        imageUrl.push(String(images));
    }
    }else{
        imageUrl.push("");
    }
    
    // (complainId as string).split(",").forEach( async (id:string) => {
        console.log(`url image`, imageUrl)
        const shopcomment = await prisma.shopComment.create({
            data: {
                complainId: Number(complainId),
                description: description as string,
                image: imageUrl.join(",")
            }
        })
        const getComplain = await prisma.complain.findFirst({
            where:{id: Number(complainId)},
            select:{
                orderId:true
            }
        })
        const order = await prisma.order.update({
            where:{id: Number(getComplain?.orderId)},
            data:{
                OrderStatus: OrderStatus.NEED_ADMIN_REVIEW
            }
        })
    // })
    // console.log((complainId as string).split(","))
    res.status(200).json({ message: 'success' });
    try {
        // // // // CREATE
        // const complain = await prisma.complain.create({
        //     data: {
        //         complainId: Number(complainId),
        //         description: description as string,
        //         image: imageUrl.join(",")
        //         // image: image as string
        //     }
        // })
        // const order = await prisma.order.update({
        //     where:{id: Number(complainId)},
        //     data:{
        //         OrderStatus: OrderStatus.NEED_ADMIN_REVIEW
        //     }
        // })
        // const shopcomment = await prisma.shopComment.create({
        //     data: {
        //         complainId: Number(complainId),
        //         description: description as string,
        //         image: imageUrl.join(",")
        //     }
        // })
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};