import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status, TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id, price} = req.body
  const session = await getSession({req})  

  
  let transaction = await prisma.transaction.create({
    data:{
      productInCartId: Number(id),
      status: TransactionStatus.PAID
    }
  });
  
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
        "order_id": transaction.id,
        "gross_amount": price
    },
    "callbacks": {
      "finish": "http://localhost:3000/redirect"
    }
  };

  snap.createTransaction(parameter)
    .then((transaction : any)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
        console.log('url:', transaction.redirect_url);
        res.status(200).json({ token: transactionToken, redirectUrl: transaction.redirect_url })
  })

  // try {
  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}