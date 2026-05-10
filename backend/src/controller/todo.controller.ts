import type { Request, Response } from "express"
import { findUserByUserId } from "../db/user.db.js"
import { createTodo, findTodoAndUpdate, getTodos, deleteTodoById } from "../db/todo.db.js"

const addTodo = async(req: Request, res: Response) => {
  const { title, description, tags } = req.body
  if (!req.user?.id) {
    return res.status(401).json({
      message: "Unauthorized request"
    })
  }

  const existedUser = await findUserByUserId(req.user.id)

  if(!existedUser){
    return res
      .status(400)
      .json({
        message: "user don't exist"
    })
  }

  const todo = await createTodo({
    title,
    description,
    completed: false,
    user: {
      connect: { id: existedUser.id }
    },
    tags: {
    connectOrCreate: tags.map((tag: string) => ({
      where: {
        name: tag
      },
      create: {
        name: tag
      }
    }))
  }
  })

  

  return res.status(201).json({
    message: "Todo created successfully",
    todo
  })
}

const getTodo = async(req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      message: "Unauthorized request"
    })
  }
  const todos = await getTodos(req.user.id)

  return res
    .status(200)
    .json({
      message: "fetch all todo succesfully",
      todos
    })
}

const updateTodo = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const {
    title,
    description,
    completed,
    tags
  } = req.body

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid ID"
    })
  }

  try {
    const todo = await findTodoAndUpdate(id, {
      title,
      description,
      completed,

      ...(tags && {
        tags: {
          set: [],

          connectOrCreate: tags.map((tag: string) => ({
            where: {
              name: tag
            },

            create: {
              name: tag
            }
          }))
        }
      })
    })

    return res.status(200).json(todo)

  } catch (err: any) {
    return res.status(500).json({
      error: err.message
    })
  }
}

const deleteTodo = async(req: Request, res: Response) => {
  const id  = Number(req.params.id)
  if (isNaN(id)) {
  return res.status(400).json({
      message: "Invalid ID"
    })
  }
  try{
    const todo = await deleteTodoById(id)
    return res
      .status(200)
      // .json(todo)
  }
  catch(err: any){
    return res
      .status(500)
      .json({ 
        error: err.message
      });
  }
}



export {
  addTodo,
  getTodo,
  updateTodo,
  deleteTodo
}
