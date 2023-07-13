import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})

  try {
    const notif = await prisma.notification.updateMany({
      where: {userId: session?.user.id!},
      data:{
          isSeen: true
      }
    })
    res.status(200).json({ notifications: notif })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}