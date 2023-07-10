import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id, price} = req.body
  const session = await getSession({req})  
  
  // let transaction = await prisma.transaction.create({
  //   data:{
  //     productInCartId: Number(id),
  //     status: TransactionStatus.PAID
  //   }
  // });
  
  const transaction = await prisma.transaction.updateMany({
    where:{ id: id! },
    data:{
      status: TransactionStatus.PAID
    }
  });

  const transactionData = await prisma.transaction.findFirst({
    where: {id: id!}
  })

  if(price > session?.user?.balance!){
    const midtransClient = require("midtrans-client");
    // Create Snap API instance
    let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: "SB-Mid-server-vXeCbudwtvY6YNWCF0jU6s3P",
        clientKey: "SB-Mid-client-0-5Dm5crs7WZEqTe",
    });

    let parameter = {
        "payment_type": "gopay",
        "transaction_details": {
            "order_id": id,
            "gross_amount": Number(price) - Number(session?.user?.balance!)
        },
        "callbacks": {
            "finish": "http://localhost:3000/redirect"
        }
    };
    
    const user = await prisma.user.update({
      where: {id: session?.user.id!},
      data:{
          balance: 0
      }
    })

    snap.createTransaction(parameter)
        .then((transaction : any)=>{
            // transaction token
            let transactionToken = transaction.token;
            console.log('transactionToken:',transactionToken);
            console.log('url:', transaction.redirect_url);
            res.status(200).json({ token: transactionToken, redirectUrl: transaction.redirect_url })
    })
  } else {
    const currentBalance = session?.user?.balance! - Number(price);
    const user = await prisma.user.update({
        where: {id: session?.user.id!},
        data:{
            balance: currentBalance
        }
    })
    res.status(200).json({ token: "", redirectUrl: `http://localhost:3000/redirect?order_id=${id}&status_code=200&transaction_status=settlement` })
  }
}