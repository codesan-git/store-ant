import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {id } = req.body;
  const session = await getSession({req});

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session?.user?.id
    }
  });
  
  await prisma.address.deleteMany({
    where:{ 
        id: Number(id),
        profileId: profile?.id!
    }
  });
  res.status(200).json({ message: 'address deleted' });
  // try {
    
  // } catch (error) {
  //   ////console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}