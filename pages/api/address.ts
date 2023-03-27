import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma"

type Data = {
  message: string
}

export default async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {address} = req.body

  try {
    // CREATE
    await prisma.address.create({
      data: {
        profileId: 1,
        address: address
      }
    })
    res.status(200).json({ message: 'Address created' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}