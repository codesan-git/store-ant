import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from "../../../lib/prisma"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = req.query.id;

  if(req.method === 'GET'){
    try{
      console.log('ENTER SHOP GET');
      const shop = await prisma?.shop.findFirst({
        where: {
          id: Number(id)
        },
        select: {
          id:true,
          userId: true,
          shopName: true,
        }
      });
      console.log({shop: shop})
      res.status(200).json({shop});
    }
    catch (error) {

    }
  }
}

export default handler;