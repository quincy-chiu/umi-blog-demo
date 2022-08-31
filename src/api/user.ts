import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'GET':
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email
        }
      });
      // if (!user) {
      //   res.status(401).json({ message: })
      // }
      res.status(200).json(user);
      await prisma.$disconnect()
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
