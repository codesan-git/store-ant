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

  try {
    await prisma.address.update({
      where:{ id: id!},
      data: {
        isShopAddress: true
      }
    })
    res.status(200).json({ message: 'shop address set' })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}