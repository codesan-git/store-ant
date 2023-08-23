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
  const {id } = req.body
  const session = await getSession({req})

  await prisma.address.updateMany({
    where:{ 
      id: { not: id}, 
      profile: {
        userId: session?.user.id
      }
    },
    data: {
      isMainAddress: false
    }
  });

  await prisma.address.update({
    where:{ id: id!},
    data: {
      isMainAddress: true
    }
  });
  res.status(200).json({ message: 'main address set' })

  // try {
    
  // } catch (error) {
  //   ////console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}