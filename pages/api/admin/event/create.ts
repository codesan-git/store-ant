import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../../lib/prisma"
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {    
    const {eventName, eventPath, startDate, endDate, image} = req.body;

    try {
        const event = await prisma.event.create({
          data: {
              eventName: eventName as string,
              eventPath: eventPath as string,
              startDate: new Date(startDate as string),
              endDate: new Date(endDate as string),
              image: image as string
          }
        })
        res.status(200).json({ message: 'product created', data: event });
    } catch (error) {
        res.status(400).json({ message: "Fail" })
    }
};