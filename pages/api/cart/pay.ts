import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { Status } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id, price} = req.body
  const session = await getSession({req})  

  console.log("price: ", price);
  const midtransClient = require("midtrans-client");
  // Create Snap API instance
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-vXeCbudwtvY6YNWCF0jU6s3P",
    clientKey: "SB-Mid-client-0-5Dm5crs7WZEqTe",
  });

  let parameter = {
    transaction_details: {
      order_id: "transcation-order-" + id,
      gross_amount: price,
    },
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: "http://localhost:3000/redirect"
    }
  };

  snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
        console.log('url:', transaction.redirect_url);
        res.status(200).json({ token: transactionToken, redirectUrl: transaction.redirect_url })
  })

  // try {
  //   let cart = await prisma.cart.findFirst({
  //     where: {userId: session?.user.id}
  //   });

  //   const productInCart = await prisma.productInCart.update({
  //       where:{id: Number(id)},
  //       data:{
  //           status: Status.PACKING
  //       }
  //   })
  //   res.status(200).json({ message: "Success!" })
  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}