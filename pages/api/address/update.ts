import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {id, address, region, cityId, city, provinceId, province, postcode, contact } = req.body;
  const session = await getSession({req});
  const profile = await prisma.profile.findUnique({
    where: {
      userId: session?.user?.id
    }
  })  
  //console.log("ADD ADDRESS 1");
  await prisma.address.updateMany({
    where:{id: Number(id), profileId: profile?.id},
    data: {
      profileId: profile?.id!,
      address: address,
      region: region,
      cityId: cityId,
      city: city,
      provinceId: provinceId,
      province: province,
      postcode: postcode,
      contact: contact
    }
  });
  //console.log("ADD ADDRESS 2");
  res.status(200).json({ message: 'address created' });
  // try {
    
  // } catch (error) {
  //   ////console.log(error)
  //   res.status(400).json({ message: "Fail" })
  // }
}