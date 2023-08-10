import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: searchedId } = req.query;

  if(req.method === 'GET'){
    try{
      const category = await prisma?.category.findFirst({
        where: {
          id: Number(searchedId),
        },
        select: {
          id: true,
          category: true
        }
      });
    
      res.status(200).json({
        category
      });
    }
    catch(e){
      //console.log(e);
    }
  }
}

export default handler;
