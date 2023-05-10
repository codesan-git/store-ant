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
        options.uploadDir = path.join(process.cwd(), "/public/images/ratings");
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
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/ratings"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/ratings"));
    }    

    const { fields, files } = await readFile(req, true);
    const {cartId, star, comment} = fields;
    let avgRating = 0, ratingTotal = 0;

    const file = files.image;
    let url = Array.isArray(file) ? file.map((f) => f.filepath) : file?.filepath;

    const oldRating = await prisma.rating.findFirst({
        where: {productInCartId: Number(cartId)},
        select: {
          image: true
        }
    });

    let imageUrl;
    if(url){    
      imageUrl = String(url);
      imageUrl = imageUrl.substring(imageUrl.indexOf("images"));      
      fs.unlink(path.join(process.cwd(), `public\\${oldRating?.image!}`));
    }else{
      imageUrl = oldRating?.image;
    }

  try {
    const rating = await prisma.rating.upsert({
        where:{productInCartId: Number(cartId)},
        create:{
            productInCartId: Number(cartId),
            rate: Number(star),
            comment: comment as string,
            image: imageUrl
        },
        update:{
            rate: Number(star),
            comment: comment as string,
            image: imageUrl
        }
    })

    const productInCart = await prisma.productInCart.findFirst({
        where: {id: Number(cartId)}
    })

    const product = await prisma.product.findFirst({
        where:{id: productInCart?.productId}
    })
    
    let ratings = await prisma.rating.findMany({
        where:{
            productInCart:{
                product:{
                    shopId: product?.shopId
                }
            }
        }
    })

    let i;
    for(i = 0; i < ratings?.length; i++){
        ratingTotal += ratings[i].rate;
    }
    avgRating = ratingTotal / ratings?.length;

    const shop = await prisma.shop.update({
        where:{id: product?.shopId},
        data:{
            averageRating: avgRating
        }
    })

    ratings = await prisma.rating.findMany({
        where:{
            productInCart:{
                productId: product?.id
             }
        }
    })

    i = 0; ratingTotal = 0; avgRating = 0;
    for(i = 0; i < ratings?.length; i++){
        ratingTotal += ratings[i].rate;
    }
    avgRating = ratingTotal / ratings?.length;

    const productEdit = await prisma.product.update({
        where:{id: product?.id},
        data:{
            averageRating: avgRating
        }
    })

    res.status(200).json({ rating: rating })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}