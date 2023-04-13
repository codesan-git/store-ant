import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const categories = await prisma.category.findMany({
      select:{
          id: true,
          category: true
      }
    })
  res.status(200).json({categories})
  console.log(res)
  } catch (error) {
    console.log(error)
  }
}