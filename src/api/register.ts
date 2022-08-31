import { signToken } from '@/utils/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UmiApiRequest, UmiApiResponse } from 'umi';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const prisma = new PrismaClient();
        let user = await prisma.user.findUnique({
          where: {
            email: req.body.email,
          },
        });
        if (user) {
          res.status(401).json({
            result: false,
            message: 'Duplicate email',
          });
        } else {
          user = await prisma.user.create({
            data: {
              email: req.body.email,
              passwordHash: bcrypt.hashSync(req.body.password, 8),
              name: req.body.name,
              avatarUrl: req.body.avatarUrl,
            },
          });
          res
            .status(201)
            .setCookie('token', await signToken(user.id))
            .setCookie('email', req.body.email)
            .json({ ...user, passwordHash: undefined });
        }

        await prisma.$disconnect();
      } catch (e: any) {
        res.status(500).json({
          result: false,
          message:
            typeof e.code === 'string'
              ? 'https://www.prisma.io/docs/reference/api-reference/error-reference#' +
                e.code.toLowerCase()
              : e,
        });
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
