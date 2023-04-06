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
  const {address, region, city, province, postcode, contact } = req.body
  const session = await getSession({req})
  const profile = await prisma.profile.findUnique({
    where: {
      userId: session?.user?.id
    }
  })

  try {
    await prisma.address.create({
      data: {
        profileId: profile?.id!,
        address: address,
        region: region,
        city: city,
        province: province,
        postcode: postcode,
        contact: contact
      }
    })
    res.status(200).json({ message: 'address created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}