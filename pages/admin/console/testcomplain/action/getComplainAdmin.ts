import { prisma } from "@/lib/prisma";

const getData = async () => {
    const getComplain = await prisma.complain.findMany({
        include: {
            order: {
                include: {
                    transaction: {
                        include:{
                            user:true,
                            shop:true
                        }
                    },
                    product:{
                        select:{
                            name:true
                        }
                    }
                }
            },
            ShopComment: true
        }
    })
    const safeComplain = getComplain.map((complain) => ({
        ...complain,
        order: {
            ...complain.order,
            createdAt: complain.order.createdAt.toISOString(),
            updatedAt: complain.order.updatedAt.toISOString(),
            transaction: {
                ...complain.order.transaction,
                createdAt: complain.order.transaction.createdAt.toISOString(),
                updatedAt: complain.order.transaction.updatedAt.toISOString(),
                user:{
                    ...complain.order.transaction.user,
                },
                shop:{
                    ...complain.order.transaction.shop,
                }
            },
            product:{
                name: complain.order.product.name
            }
        },
        ShopComment: {
            ...complain.ShopComment
        }
    }))
    return safeComplain
}

export default getData