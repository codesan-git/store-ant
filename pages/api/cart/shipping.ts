import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shopId, totalWeight } = req.body;
  const session = await getSession({ req });

  const userAdress = await prisma.address.findFirst({
    where: {
      profile: {
        userId: session?.user.id,
      },
      isMainAddress: true,
    },
  });

  const shopAddress = await prisma.address.findFirst({
    where: {
      profile: {
        user:{
            shop: {id: shopId}
        }
      },
      isShopAddress: true,
    },
  });

  console.log("origin: ", userAdress?.cityId, " destination: ", shopAddress?.cityId, " weight: ", totalWeight);
  var options = {
    headers: { 'key': "7d840a0e0bb1962debcae4fd1f65fb8e"}
  };

  const form = {
    origin: shopAddress?.cityId,
    destination: userAdress?.cityId,
    weight: Number(100),
    courier: "jne",
  };
  const costRes = await axios.post("https://api.rajaongkir.com/starter/cost", form, options);
  const cost = costRes.data.rajaongkir.results[0].costs.filter((x: any) => x.service == "REG")[0];
  console.log("COST: ", cost);

  res.status(200).json({cost});
  //   try {
  //   } catch (error) {
  //     //console.log(error)
  //     res.status(400).json({ message: "Fail" })
  //   }
}
