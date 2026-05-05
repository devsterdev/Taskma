import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client'

type CreateUserInput = {
  email: string;
  name: string;
  password: string;
  refreshToken: string
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

export const findUserByUserId = (id: number) => {
  return client.user.findUnique({
    where: {id},
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      refreshToken: true
    }
  })
}

export const updateUser = (id: number, refreshToken: string) => {
  return client.user.update({
    where: {id},
    data: {
      refreshToken
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  })
}
