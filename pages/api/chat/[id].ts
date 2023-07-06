import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})
  const id = req.query.id

  const messages = await prisma.message.findMany({
    where: { conversationId: Number(id) }
  });

  let recipientId;
  if(messages[0].senderId == session?.user.id)
    recipientId = messages[0].recipientId;
  else
    recipientId = messages[0].senderId;

  const recipient = await prisma.user.findFirst({
    where: {id: recipientId},
    select:{
        name: true,
        image: true,
        shop:{
            select:{
                shopName: true,
                image: true
            }
        }
    }
  })
  
  try {
    res.status(200).json({ messages: messages, recipient: recipient });
  } catch (error) {
    res.status(400).json({ message: "Fail" })
  }
}