import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  let shops = new Array();
  let transactionDetails = new Array();
  let transactions = new Array();
  const productInCart = await prisma.productInCart.findFirst({
    where: { id: Number(id[0]) },
    select: {
      productId: true,
      count: true,
      product: {
        select: { shop: true}
      }
    }
  });

  let i: number;
  let j: number;
  for(i=0; i < id.length; i++){
      let productInCart = await prisma.productInCart.findFirst({
          where:{id: Number(id[i])},
          select: {
            productId: true,
            count: true,
            product: {
              select: { name: true, shop: true}
            }
          }
      })

      if(!shops.includes(productInCart?.product?.shop)){
        shops.push(productInCart?.product?.shop);
        transactionDetails.push(new Array());
      }
  }
  
  const address = await prisma.address.findFirst({
    where: {
      profile: { userId: session?.user.id},
      isMainAddress: true
    }
  });

  for(i = 0; i < shops.length; i++){   
    let transaction = await prisma.transaction.create({
      data:{
        userId: session?.user.id!,
        shopId: shops[i]?.id!,
        paymentMethod: "",
        status: TransactionStatus.UNPAID,
        userAddressId: address?.id!,
        updatedAt: new Date()
      }
    });
    transactions.push(transaction);

    for(j=0; j < id.length; j++){
        let productInCart = await prisma.productInCart.findFirst({
            where:{id: Number(id[j])},
            select: {
              id: true,
              productId: true,
              count: true,
              product: {
                select: { shop: true}
              }
            }
        })

        if(productInCart?.product?.shop.id == shops[i].id){
          transactionDetails[i].push(productInCart);
        }
    }
  }

  for(i = 0; i < transactionDetails.length; i++){
    for(j = 0; j < transactionDetails[i].length; j++){
      let order = await prisma.order.create({
        data:{
          transactionId: transactions[i].id!,
          productId: transactionDetails[i][j].productId!,
          count: transactionDetails[i][j].count!,
        }
      });
  
      await prisma.productInCart.delete({
        where: {id: Number(transactionDetails[i][j].id)}
      });
    }
  }

  res.status(200).json({ message: "Success!" })
  // try {
    
  // } catch (error) {
  //   //console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}