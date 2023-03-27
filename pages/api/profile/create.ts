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
  const {username, password, phonenumber, address} = req.body
  const session = await getSession({req})
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  })

  try {
    // // // CREATE
    await prisma.profile.create({
      data: {
        userId: user?.id!,
        username: username,
        password: password,
        phoneNumber: phonenumber,
        addresses: {}
      }
    })
    res.status(200).json({ message: 'Profile created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}