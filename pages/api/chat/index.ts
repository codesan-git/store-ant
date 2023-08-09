import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({req})

  if(req.method === 'GET'){
    let convoId = new Array<number>();
    try {
      const conversation = await prisma.conversation.findMany({
        include:{
          messages: true
        }
      });
    
      if(conversation){
        conversation.forEach(conversation => {
          conversation.messages.every(message => {
            if(message.senderId == session?.user.id || message.recipientId == session?.user.id){
              convoId.push(conversation.id);
              return false;
            }
            return true;
          })
        });
      }

      const data = await prisma.conversation.findMany({
          where: { 
            id: {
              in: convoId 
            }
           },
          include: {
            messages: {
              include:{
                sender: {
                  select: {
                    id:true,
                    name: true,
                    image: true,
                    shop: {
                      select: {
                        shopName: true,
                        image: true
                      }
                    }
                  }
                },
                recipient: {
                  select: {
                    id:true,
                    name: true,
                    image: true,
                    shop:{
                      select:{
                        shopName: true,
                        image: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
      res.status(200).json({ conversations: data })
    } catch (error) {
      ////console.log(error)
      res.status(400).json({ message: "Fail" })
    }
  }
}