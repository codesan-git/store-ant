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
  const {username, password, phonenumber, emailVerified, birthDate, gender} = req.body
  const session = await getSession({req})

  console.log("session profile", session)

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.profile.upsert({
      where: {userId: session?.user?.id},
      create: {
        userId: session?.user?.id!,
        username: username,
        password: hashedPassword,
        phoneNumber: phonenumber,
        birthDate: birthDate,
        gender: gender,
        addresses: {}
      },
      update: {
        // ...req.body
        username: username,
        password: hashedPassword,
        phoneNumber: phonenumber,
        birthDate: birthDate,
        gender: gender
      }
    });
    res.status(200).json({ message: 'Profile created' })
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}