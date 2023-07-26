import { prisma } from "@/lib/prisma";

export interface ShopParams {
    shopName: string
}

const getDataShop = async (params: string) => {
    let query:any = {}
    if(params){
        query.shopName = params
    }
    console.log(`currUser`, params)
    const getShop = await prisma.shop.findFirst({
        where: query,
        include:{
            product:true
        }
    })
    console.log(`getShop`, getShop)

    if (!getShop) return;

    return getShop
}

export default getDataShop