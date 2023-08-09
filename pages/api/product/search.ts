import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {q: query} = req.query;

  if(typeof query !== "string"){
    throw new Error("invalid request")!
  }

  const session = await getSession({req});

  try {
    // // // CREATE
    const products = await prisma.product.findMany({
      where: {
        OR: [
            {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            {
                shop: {
                    shopName: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            }
        ]
      },
      include: {
        shop: true
      }
    })
    //console.log(products);
    res.status(200).json({products});
  } catch (error) {
    ////console.log(error);
    res.status(400).json({ message: "Fail" });
  }
}