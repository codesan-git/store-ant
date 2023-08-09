import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from "../../../lib/prisma"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;

  if(req.method === 'GET'){
    try{
      const user = await prisma?.user.findFirst({
        where: {
          id: id
        },
        select: {
          id:true,
          name: true,
          image: true,
          shop: true,
        }
      });
      //console.log({user: user})
      res.status(200).json({user});
    }
    catch (error) {

    }
  }
}

export default handler;