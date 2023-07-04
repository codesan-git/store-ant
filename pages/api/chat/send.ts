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
  
  // const conversation = await prisma.conversation.findFirst({
  //   where: { 
  //     OR: [
  //       {
  //         AND: [
  //           {recipientId: session?.user?.id},
  //           {senderId: String(recipientId)}
  //         ]
  //       },
  //       {
  //         AND: [
  //           {senderId: session?.user?.id},
  //           {recipientId: String(recipientId)}
  //         ]
  //       }
  //     ]
  //   }
  // });

  // if(!conversation){
  //   const newConvo = await prisma.conversation.create({
  //     data:{
  //       senderId: String(session?.user.id),
  //       recipientId: String(recipientId)
  //     }
  //   })
  //   convoId = newConvo.id;
  // }else{
  //   convoId = conversation.id;
  // }

  const messageData = await prisma.message.create({
      data: {
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