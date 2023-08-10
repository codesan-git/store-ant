import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../../lib/prisma"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})
  
  if(req.method === 'GET'){
    try {
      const bank = await prisma.bankAccount.findFirst({
        where: { userId: session?.user.id! }
      })
    res.status(200).json({bank})
    console.log(res)
    } catch (error) {
      //console.log(error)
    }
  }
}