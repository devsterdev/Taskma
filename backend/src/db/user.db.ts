import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client'

type CreateUserInput = {
  email: string;
  name: string;
  password?: string | null;
  googleId?: string | null;
  refreshToken?: string;
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

export const updateUserGoogleId = (id: number, googleId: string) => {
  return client.user.update({
    where: {id},
    data: {
      googleId
    }
  })
}

export const findUserByUserId = (id: number) => {
  return client.user.findUnique({
    where: {id},
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
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
