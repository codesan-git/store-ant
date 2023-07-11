import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import React from 'react';
import { getSession } from 'next-auth/react';
import { prisma } from "../../lib/prisma";
import { Product, TransactionStatus } from '@prisma/client';

interface Order {
    id: number,
    transactionId: number,
    productId: number,
    count: number,
    createdAt: Date,
    updatedAt: Date,
    product: Product
}
  
interface Transaction {
    transaction: {
        id: string,
        userId: string,
        shopId: number,
        status: TransactionStatus,
        createdAt: Date,
        updatedAt: Date,
        paymentMethod: string,
        order: Order[],
        shop: {
            shopName: string
        } 
    }
}

export default function Track({transaction} : Transaction) {
  const router = useRouter();
  const {id} = router.query;

  return (
    <div>
        <p>Kode Transaksi: {transaction.id}</p>
        <p>No. Resi: JP123456</p>
        {transaction.status == TransactionStatus.DELIVERING ? (
            <p>Paket dalam perjalanan</p>
        ) : (
            <p>Paket telah sampai</p>
        )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: String(id)
      },
      select: {
        id: true,
        userId: true,
        shopId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        paymentMethod: true,
        order: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                description: true,
                price: true,
                weight: true
              }
            }
          }
        },
        shop: {
          select: {
            shopName: true
          }
        }
      }
      
    });
  
    console.log(JSON.parse(JSON.stringify(transaction)));
  
    return {
      props: {
        transaction: JSON.parse(JSON.stringify(transaction)),
      },
    };
  };
  