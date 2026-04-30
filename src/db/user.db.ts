import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client'

type CreateUserInput = {
  email: string;
  username: string;
  name: string;
  password: string;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const client = new PrismaClient({adapter})

export const findUserByEmail = (email: string) => {
  return client.user.findUnique({
    where: {email}
  })
}

export const createUser = (data: CreateUserInput) => {
  return client.user.create({
    data
  })
}