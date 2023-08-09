import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const id = req.query.id;

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  if (req.method === "GET") {
    try {
      const account = await prisma.account.findFirst({
        where: {userId:user?.id!}
      })
      res.status(200).json(account?.access_token!);
      //console.log(res);
    } catch (error) {
      ////console.log(error);
    }
  }
}
