import { Prisma } from '@prisma/client'
import { client } from './user.db.js';


type TodoCreateInput = {
  title: string
  description: string
  completed: boolean
  dueDate?: Date
  userId: number
  tags: string[]
}

export const createTodo = (data: Prisma.TodoCreateInput) => {
  return client.todo.create({
    data, 
    include: {
      tags: true
    }
  })
}

export const getTodos = (id: number) =>  {
  return client.todo.findMany({
    where: {userId: id},
    include: {
      tags: true
    }
  })
}

export const findTodoAndUpdate = (id: number, updates: Prisma.TodoUpdateInput) => {
  return client.todo.update({
    where: {id},
    data: updates,
    include: {
      tags: true
    }
  })
}

export const deleteTodoById = async (id: number) => {
  const todo = await client.todo.findUnique({
    where: { id }
  })

  if (!todo) {
    return null
  }

  return client.todo.delete({
    where: { id }
  })
}
