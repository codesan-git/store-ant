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

  console.log("shop adress: ", shopAddress, " user address: ", userAdress);
  console.log("condition: ", shopAddress != undefined && userAdress != undefined);
  if(shopAddress != undefined && userAdress != undefined){
    if(shopAddress.id != userAdress.id){
      console.log("origin: ", userAdress?.cityId, " destination: ", shopAddress?.cityId, " weight: ", totalWeight);
      var options = {
        headers: { 'key': "c6ea8e82078275e61b3a46b5e65b69f1"} 
      };

      const form = {
        origin: shopAddress?.cityId,
        destination: userAdress?.cityId,
        weight: Number(100),
        courier: "jne",
      };
      const costRes = await axios.post("https://api.rajaongkir.com/starter/cost", form, options);
      const cost = costRes.data.rajaongkir.results[0].costs.filter((x: any) => x.service == "REG")[0];

      res.status(200).json({cost});
    } else {
      res.status(200).json({cost: {cost: [], service: "Alamat Pengiriman Sama"}});
    }
  } else {
    const cost = {cost: undefined, service: "Alamat Toko Belum Diatur"};
    console.log("RESPONSE: ", cost);

    if(!shopAddress){      
      res.status(200).json({cost: {cost: [], service: "Alamat Toko Belum Diatur"}});
    }
    if(!userAdress){      
      res.status(200).json({cost: {cost: [], service: "Alamat Pengiriman Utama Belum Diatur"}});
    }
  }
  //   try {
  //   } catch (error) {
  //     //console.log(error)
  //     res.status(400).json({ message: "Fail" })
  //   }
}
