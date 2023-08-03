import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
const getDataOrders = async (context: any) => {
    const currUser = await getSession(context);
    console.log(`currUser`, currUser?.user.id)
    const getShop = await prisma.shop.findFirst({
        where: {
            userId: currUser?.user.id
        }

    })
    console.log(`getShop`, getShop)
    const getTransactions = await prisma.transaction.findMany({
        where: {
            shopId: getShop?.id
        },
        include: {
            order: {
                include: {
                    Complain: true
                }
            },
            user: true,
            shop: true
        }
    })
    console.log(`getTransactions`, getTransactions)




    if (!getTransactions) return;

    const safeComplain = getTransactions.map((complain) => ({
        ...complain,
    }))
    return safeComplain
}

export default getDataOrders