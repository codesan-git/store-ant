import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})
  const id = req.query.id
  
  if(req.method === 'GET'){
    try {
      const address = await prisma.address.findFirst({
        where: { 
            id: Number(id), 
            profile: {
                userId:  session?.user.id!
            }
        }
      })
    res.status(200).json({address})
    console.log(res)
    } catch (error) {
      //console.log(error)
    }
  }
}