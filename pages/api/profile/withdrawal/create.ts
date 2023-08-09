import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../../lib/prisma";
import { BalanceType, NotifRole, NotifType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount, isUserBalance } = req.body;

  try {
    const session = await getSession({ req });

    const balanceType = isUserBalance ? BalanceType.USER : BalanceType.SHOP;

    const withdrawal = await prisma.withdrawal.create({
      data:{
        userId: session?.user.id!,
        amount: Number(amount),
        BalanceType: balanceType
      }
    })

    if(isUserBalance){
      const user = await prisma.user.update({
        where: {id: session?.user.id!},
        data:{
          balance: Number(session?.user.balance) - Number(amount)
        }
      })
    } else {
      const shop = await prisma.shop.findFirst({
        where: { userId: session?.user.id!}
      });

      const shopUpdate = await prisma.shop.update({
        where: { userId: session?.user.id!},
        data:{
          balance: Number(shop?.balance) - Number(amount)
        }
      });
    }

    const notificationUser = await prisma.notification.create({
      data:{
        userId: session?.user.id!,
        notifRole: NotifRole.USER,
        notifType: NotifType.TRANSACTION,
        body: `Permintaan penarikan dana sebesar ${amount} berhasil dibuat.`
      }
    });
    
    res.status(200).json({bankAccount: withdrawal});
  } catch (error) {
    //console.log("erorr ", error);
  }
}
