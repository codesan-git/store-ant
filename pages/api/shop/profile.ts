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
    const {name, image, oldImage} = req.body;
    const session = await getSession({req});

    console.log(image);

    try {
        const shop = await prisma.shop.update({
            where: {
                userId: session?.user?.id
            },
            data:{
                image: image,
                shopName: name as string
            }
        })
        res.status(200).json({ message: 'shop updated'});
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};
