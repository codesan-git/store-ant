import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})

  if(req.method === 'GET'){
    try {
      const notif = await prisma.notification.findMany({
        where: {userId: session?.user.id, isSeen: false}
      })
      res.status(200).json({ count: notif.length })
    } catch (error) {
      ////console.log(error)
      res.status(400).json({ message: "Fail" })
    }
  }
}