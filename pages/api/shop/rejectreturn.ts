import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { NotifRole, NotifType, OrderStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { complainId, description, urls } = req.body;
  const session = await getSession({ req });

  const complain = await prisma.complain.findFirst({
    where: {id: Number(complainId)}
  });

  let imageUrl = new Array();
  if (urls) {
    if (Array.isArray(urls)) {
      (urls as string[]).forEach((url) => {
        imageUrl.push(String(url));
      });
    } else {
      imageUrl.push(String(urls));
    }
  } else {
    imageUrl.push("");
  }

  try {
    let shopComment = await prisma.shopComment.create({
      data:{
        complainId: Number(complainId),
        description: description as string,
        image: imageUrl.join(",")
      }
    });

    const order = await prisma.order.update({
      where: { id: complain?.orderId },
      data: {
        OrderStatus: OrderStatus.NEED_ADMIN_REVIEW,
      },
    });

    const transaction = await prisma.transaction.findFirst({
      where: { id: order.transactionId}
    });
    
    const notificationUser = await prisma.notification.create({
      data:{
        userId: transaction?.userId!,
        notifRole: NotifRole.USER,
        notifType: NotifType.TRANSACTION,
        body: `Permintaan pengembalian barang untuk transaksi ${order.transactionId} ditolak toko, menunggu persetujuan admin.`
      }
    });
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    ////console.log(error)
    res.status(400).json({ message: "Fail" });
  }
}