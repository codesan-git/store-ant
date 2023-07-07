import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recipientId, message } = req.body
  const session = await getSession({req})

  console.log("SEND ", message);

  let convoId;
  
  const conversation = await prisma.conversation.findMany({
    include:{
      messages: true
    }
  });

  if(conversation){
    conversation.forEach(conversation => {
      conversation.messages.forEach(message => {
        if((message.senderId == session?.user.id && message.recipientId == recipientId) || (message.recipientId == session?.user.id && message.senderId == recipientId)){
          convoId = conversation.id;
        }
      })
    });
  }

  if(!conversation || !convoId){
    const newConvo = await prisma.conversation.create({
      data:{

      }
    });
    convoId = newConvo.id;
  }

  console.log("convo id: ", convoId);
  const messageData = await prisma.message.create({
      data: {
        conversationId: convoId,
        senderId: String(session?.user.id!),
        recipientId: String(recipientId),
        message: String(message)
      }
  });
  res.status(200).json({ message: 'message created' })
  // try {
  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}