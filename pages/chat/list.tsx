import axios from 'axios';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, {useState, useEffect, FormEvent} from 'react';
import { Socket, io } from 'socket.io-client';

interface Conversation {
  id: number;
  messages: Message[];
}

interface Message {
  id: number;
  message: string;
  senderId: string;
  recipientId: string;
  sender: User;
  recipient: User;
  createdAt: Date,
  isSeen: boolean,
}

interface User {
  name: string;
  image: string;
  shop: Shop;
}

interface Shop {
  name: string;
  image: string;
}

export default function List() {
  const [conversations, setConversations] = useState<Conversation[]>();
  const { data: session } = useSession();

  useEffect(() => {
    fetchConversation();
  },[])

  async function fetchConversation() {
    const res = await axios.get("/api/chat");
    setConversations(res.data.conversations);
    //console.log(res.data.conversations);
  }

  return (
    <div className='flex'>
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Chats</th>
                    </tr>
                </thead>
                {conversations?.map((conversation, i) => (
                    <tbody key={conversation.id}>
                        <td className={(i % 2 == 1 ? "bg-gray-100" : "bg-white")}>
                            {conversation.messages[0].senderId == session?.user.id ? (
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={conversation.messages[0].recipient.image} alt="Avatar Tailwind CSS Component" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{conversation.messages[0].recipient.name}</div>
                                        <div className="text-sm opacity-50">{conversation.messages[conversation.messages.length - 1].message}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={conversation.messages[0].sender.image} alt="Avatar Tailwind CSS Component" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{conversation.messages[0].sender.name}</div>
                                        <div className="text-sm opacity-50">{conversation.messages[conversation.messages.length - 1].message}</div>
                                    </div>
                                </div>
                            )}
                        </td>
                    </tbody>
                ))}
            </table>
        </div>
        <div className='bg-gray-200 w-2/3'>
            HALO
        </div>
    </div>
  )
}