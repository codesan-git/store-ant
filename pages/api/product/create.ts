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
        options.multiples = true;
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
    const { fields, files } = await readFile(req, true);
    const {name, price, stock, categoryId, description} = fields;
    const session = await getSession({req})
    const shop = await prisma.shop.findUnique({
        where: {
        userId: session?.user?.id
        },
    })

    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/products"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/products"));
    }    
    const file = files.image;
    let urls = Array.isArray(file) ? file.map((f) => f.filepath) : file.filepath;

    let imageUrl = new Array();
    if(urls){    
      if(Array.isArray(urls)){
        (urls as string[]).forEach((url) => {
            imageUrl.push(String(url).substring(String(url).indexOf("images")));
        })
      } else{
        imageUrl.push(String(urls).substring(String(urls).indexOf("images")));
      }
    }else{
      imageUrl.push("");
    }

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
                image: imageUrl.join(",")
            }
        })
        res.status(200).json({ message: 'product created', data: product });
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};