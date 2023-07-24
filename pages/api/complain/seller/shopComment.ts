import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "@/lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"
import { OrderStatus } from '@prisma/client';

export const config = {
    api: {
        bodyParser: false
    }
};

const readFile = (req: NextApiRequest, saveLocally?: boolean) 
: Promise<{fields: formidable.Fields; files: formidable.Files}> => {
    const options: formidable.Options = {};
    if(saveLocally){
        options.uploadDir = path.join(process.cwd(), "/public/images/complains/shopcomment");
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
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/complains/shopcomment"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/complains/shopcomment"));
    } 

    const { fields, files } = await readFile(req, true);
    const {complainId, description} = fields;
    console.log(`console back`, fields)
    const session = await getSession({req});
    (complainId as string).split(",").forEach( async (id:string) => {
        const order = await prisma.order.update({
            where:{id: Number(id)},
            data:{
                OrderStatus: OrderStatus.NEED_ADMIN_REVIEW
            }
        })
        const shopcomment = await prisma.shopComment.create({
            data: {
                complainId: Number(id),
                description: description as string,
                image: imageUrl.join(",")
            }
        })
    })
   
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
    
    console.log((complainId as string).split(","))
    res.status(200).json({ message: 'shop created' });
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