import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recipientId, Message } = req.body
  const session = await getSession({req})

  let convoId;
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { 
        OR: [
          {
            AND: [
              {recipientId: session?.user?.id},
              {senderId: String(recipientId)}
            ]
          },
          {
            AND: [
              {senderId: session?.user?.id},
              {recipientId: String(recipientId)}
            ]
          }
        ]
      }
    });

    const messages = await prisma.message.findMany({
        where: { conversationId: conversation?.id },
        select: {
          message: true
        },
      });
    res.status(200).json({ messages: messages })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}