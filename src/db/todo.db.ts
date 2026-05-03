import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client'
import { client } from './user.db.js';


type TodoCreateInput = {
  title: string
  description: string
  completed: boolean
  userId: number
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const createTodo = (data: Prisma.TodoCreateInput) => {
  return client.todo.create({
    data
  })
}