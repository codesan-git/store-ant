import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { password, newPassword, confirmNewPassword } = req.body;

  //console.log("password", password);

  try {
    
  } catch (error) {
    
  }
}
