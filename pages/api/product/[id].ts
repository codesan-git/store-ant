import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})
  const id = req.query.id
  
  const shop = await prisma.shop.findFirst({
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
            stock: true,
            category: true
        }
      })
    res.status(200).json({product})
    console.log(res)
    } catch (error) {
      //console.log(error)
    }
  }

  if(req.method === 'DELETE'){
    try {
      const product = await prisma.product.deleteMany({
        where: { id: Number(id), shopId: shop?.id } 
      })
    res.json(product)
    } catch (error) {
      //console.log(error)
    }
  }

  if(req.method === 'PUT'){
    const {imageString, name, price, stock, categoryId, urls} = req.body;

    try {
      const oldProduct = await prisma.product.findFirst({
        where: {id: Number(id)},
        select: {
          image: true
        }
      });
      
      let imageUrl = new Array();
      if(imageString !== ""){
          ((imageString as string).split(",")).forEach((image) => {
            imageUrl.push(image);
          })
      }
  
      if(urls){    
        if(Array.isArray(urls.split(","))){
          (urls as string[]).forEach((url) => {
              imageUrl.push(String(url));
          })
        } else{
          imageUrl.push(String(urls));
        }
      }
      
      const product = await prisma.product.update({
        where: {id: Number(id)},
        data: {
            categoryId: Number(categoryId!),
            name: name as string,
            price: Number(price),
            stock: Number(stock),
            image: imageUrl.join(",")
        }
      })
      res.status(200).json({ message: 'product updated', data: product });
    } catch (error) {
      res.status(400).json({ message: "Fail" })
    }
  }
}