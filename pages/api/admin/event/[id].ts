import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../lib/prisma";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { image, eventName, eventPath, startDate, endDate, oldImage } = req.body;
  const id = req.query.id;

  let imageUrl = new Array();
  if (image) {
    if (Array.isArray(image)) {
      (image as string[]).forEach((url) => {
        imageUrl.push(String(url));
      });
    } else {
      imageUrl.push(String(image));
    }
  } else {
    imageUrl.push(oldImage);
  }

  if(req.method === "PUT"){
    try {
      const event = await prisma.event.update({
        where: { id: Number(id) },
        data: {
          eventName: eventName as string,
          eventPath: eventPath as string,
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
          image: imageUrl.join(","),
        },
      });
      res.status(200).json({ message: "product created", data: event });
    } catch (error) {
      res.status(400).json({ message: "Fail" });
    }
  }
  
  if(req.method === "DELETE"){
    try {
      const event = await prisma.event.deleteMany({
        where: { id: Number(id) } 
      })
      res.json(event)
    } catch (error) {
      ////console.log(error)
    }
  }
}
