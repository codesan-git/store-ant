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
    const {name, price, stock, image, categoryId, description} = req.body;
    const session = await getSession({req});

    console.log("image: ", image);
    const shop = await prisma.shop.findUnique({
        where: {
            userId: session?.user?.id
        },
    })

    try {
        // // // CREATE
        const product = await prisma.product.create({
            data: {
                shopId: shop?.id!,
                categoryId: Number(categoryId),
                name: name as string,
                price: Number(price),
                stock: Number(stock),
                description: description as string,
                image: image
            }
        })
        res.status(200).json({ message: 'product created', data: product });
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};