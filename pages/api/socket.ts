import React from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from "socket.io";
import { io } from 'socket.io-client'

export default function SocketHandler(
    req: NextApiRequest,
    res: any
){
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) =>{
        socket.on("send-message", (obj) => {
            io.emit("receive-message", obj);
        });
    });
    console.log("setting socket");
    res.end();
}