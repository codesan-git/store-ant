import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcrypt"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {email} = req.body
  const session = await getSession({req})

  try {
    await prisma.user.update({
      where: {id: session?.user?.id},
      data: {
        email: email
      }
    })
    res.status(200).json({ message: 'Email updated' })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}