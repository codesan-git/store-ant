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
    // const productCount = await prisma.product.count()

    const products = await prisma.product.findMany({
        select:{
            id:true,
            name:true,
            price: true,
            stock:true,
        },
        orderBy,
        // skip: offset,
        // take: limit
    })

    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('x-total-count', productCount);
    res.status(200).json(products);


//   try {
//     const products = await prisma.product.findMany({
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         stock: true,
//       },
//     });
//     console.log(products);
//     res.status(200).json({ products });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "Fail" });
//   }
}