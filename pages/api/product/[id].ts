import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {name, price, stock } = req.body
  const session = await getSession({req})
  const id = req.query.id
  
  const shop = await prisma.shop.findUnique({
    where: {
      userId: session?.user?.id
    },
  })

  if(req.method === 'GET'){
    try {
      const product = await prisma.product.findFirst({
        where: { id: Number(id), shopId: shop?.id },
        select:{
            id: true,
            name: true,
            price: true,
            stock: true
        }
      })
    res.status(200).json(product)
    } catch (error) {
      console.log(error)
    }
  }

  if(req.method === 'DELETE'){
    try {
      const product = await prisma.product.deleteMany({
        where: { id: Number(id), shopId: shop?.id } 
      })
    res.json(product)
    } catch (error) {
      console.log(error)
    }
  }

  if(req.method === 'PATCH'){
    try {
      const product = await prisma.product.update({
        where: { id: Number(id)},
        data: {
            name: name,
            price: Number(price),
            stock: Number(stock)
        }
      })
      res.json(product)
    } catch (error) {
      console.log(error)
    }
  }
}