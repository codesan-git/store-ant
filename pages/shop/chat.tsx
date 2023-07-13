import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, {useState, useEffect, FormEvent} from 'react'
import { Socket, io } from 'socket.io-client'
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { Conversation, Shop, User } from '@prisma/client';

interface Messages {
  messages: MessageForm[];
  recipient: User;
  shop: Shop;
  //conversation: Conversation;
}

interface MessageForm {
  senderId: string;
  recipientId: string;
  message: string;
}

let socket : Socket;

export default function Chat({messages, recipient, shop} : Messages) {
  console.log(messages);
  const { data: session } = useSession();
  const router = useRouter();
  const {id: recipientId} = router.query;
  
  const [messageForm, setMessageForm] = useState<MessageForm>({senderId: String(session?.user.id), recipientId: String(recipientId), message:""});
  const [allMessage, setAllMessage] = useState<MessageForm[]>(messages);

  useEffect(() => {
    socketInitializer();
  }, [session?.user.id])

  useEffect(() => {
    if(socket)
      listen();
  })

  async function socketInitializer() {
    await fetch("/api/socket");

    socket = io('ws://localhost:3000', {transports: ['websocket']});
    console.log(session?.user.id);
    socket.emit("connect-user", session?.user.id);
  }

  async function listen(){    
    socket.on("receive-message", (data : MessageForm) => {
      console.log(data);
      setAllMessage([...allMessage, data]);
    });
  }

  function handleSubmit(e : FormEvent){
    e.preventDefault();
    socket.emit("send-message", messageForm);
    setMessageForm({...messageForm, message: ""});
    setAllMessage([...allMessage, messageForm]);
    try{
        fetch('http://localhost:3000/api/chat/send', {
            body: JSON.stringify(messageForm),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        })
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
        <h1>Chat Buyer</h1>
        <p>Recipient Name : {recipient.name}</p>
        <br/>
        <br/>

        {allMessage.map((messageData, i) => (
          <div key={String(i)}>
            {messageData.senderId == session?.user.id? (
              <div className="chat chat-end">
                <p>{shop.shopName}</p>
                <div className="chat-bubble">{messageData.message}</div>
              </div>
            ) : (
              <div className="chat chat-start">
                <p>{recipient.name}</p>
                <div className="chat-bubble">{messageData.message}</div>
              </div>
            )}
          </div>
        ))}

        <div>
          <form onSubmit={(e) => {handleSubmit(e)}}>
            <input name='message' value={messageForm.message} onChange={(e) => {setMessageForm({...messageForm, senderId: String(session?.user.id), recipientId: String(recipientId), message: e.target.value})}}/>
          </form>
        </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const messages = await prisma.message.findMany({
    where: { 
      OR: [
        {
          AND: [
            {recipientId: session?.user?.id},
            {senderId: String(context.query.id)}
          ]
        },
        {
          AND: [
            {senderId: session?.user?.id},
            {recipientId: String(context.query.id)}
          ]
        }
      ]
    },
    select: {
      message: true,
      recipientId: true,
      senderId: true
    },
  });

  const recipient = await prisma.user.findFirst({
    where: {id: String(context.query.id)}
  });

  const shop = await prisma.shop.findFirst({
    where: {userId: String(session?.user.id)}
  });

  return { 
    props: { 
      messages: messages, 
      recipient: recipient,
      shop: shop
      //conversation: JSON.parse(JSON.stringify(conversation))
    } 
  };
};
