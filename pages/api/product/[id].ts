import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"

export const config = {
    api: {
        bodyParser: false
    }
};

const readFile = (req: NextApiRequest, saveLocally?: boolean) 
: Promise<{fields: formidable.Fields; files: formidable.Files}> => {
    const options: formidable.Options = {};
    if(saveLocally){
        options.uploadDir = path.join(process.cwd(), "/public/images/products");
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + path.originalFilename;
        }
    }
    const form = formidable(options);
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
          if(err) reject(err);
          resolve({fields, files});
      })
    });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const { fields, files } = await readFile(req, true);
    const {name, price, stock, categoryId} = fields

    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/products"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/products"));
    }    
    const file = files.image;
    let url = Array.isArray(file) ? file.map((f) => f.filepath) : file?.filepath;

    try {
      const oldProduct = await prisma.product.findFirst({
        where: {id: Number(id)},
        select: {
          image: true
        }
      });
    
    let imageUrl;
    if(url){    
      imageUrl = String(url);
      imageUrl = imageUrl.substring(imageUrl.indexOf("images"));      
      fs.unlink(path.join(process.cwd(), `public\\${oldProduct?.image!}`));
    }else{
      imageUrl = oldProduct?.image;
    }
      
      const product = await prisma.product.update({
        where: {id: Number(id)},
        data: {
            categoryId: Number(categoryId),
            name: name as string,
            price: Number(price),
            stock: Number(stock),
            image: imageUrl
        }
      })
      res.status(200).json({ message: 'product updated', data: product });
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
  }
}