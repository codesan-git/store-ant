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
  const {address, region, city, province, postcode } = req.body
  const session = await getSession({req})
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    }
  })
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user?.id
    }
  })

  try {
    // // // CREATE
    await prisma.address.create({
      data: {
        profileId: profile?.id!,
        address: address,
        region: region,
        city: city,
        province: province,
        postcode: postcode
      }
    })
    res.status(200).json({ message: 'address created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}