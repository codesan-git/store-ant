import React from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from "socket.io";
import { io } from 'socket.io-client'

export default function SocketHandler(
    req: NextApiRequest,
    res: any
){
    if(!res.socket.server.io){
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        let users: any[] = [];

        io.on("connection", (socket) =>{
            socket.on("connect-user", (userId) => {
                console.log(userId);
                if(userId || userId != null)
                    users[userId] = socket.id;
                console.log("users: ", users[userId]);
            });

            socket.on("send-message", (obj) => {
                io.to(users[obj.recipientId]).emit("receive-message", obj);
                console.log("users: ", users);
                console.log("id: ", socket.id);
            });
        });
        console.log("setting socket");
    } else {
        console.log("server is already set");
    }
    res.end();
}

export const config = {
    api: {
      bodyParser: false
    }
  }
  