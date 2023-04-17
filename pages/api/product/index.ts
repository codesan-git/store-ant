import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { _page, _limit, _sortBy, _sortDir} = req.query;
    // const limit = +(_limit ?? 20);
    // const offset = (+(_page ?? 1) -1 ) * limit;
    const sort = (_sortBy ?? 'id').toString();
    const order = _sortDir ?? 'asc';

    const orderBy = {[sort]: order};

    const products = await prisma.product.findMany({
        where:{stock: {not: 0}},
        select:{
            id:true,
            name:true,
            price: true,
            stock:true,
            image: true,
            category: true
        },
        orderBy,
    })
    res.status(200).json(products);
}