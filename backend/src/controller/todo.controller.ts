import type { Request, Response } from "express"
import { findUserByUserId } from "../db/user.db.js"
import { createTodo, findTodoAndUpdate, getTodos, deleteTodoById } from "../db/todo.db.js"

const parseDueDate = (dueDate: unknown) => {
  if (dueDate === undefined || dueDate === null || dueDate === "") {
    return null;
  }

  const parsedDate = new Date(String(dueDate));

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

const addTodo = async(req: Request, res: Response) => {
  const { title, description, tags, dueDate } = req.body
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

  const parsedDueDate = parseDueDate(dueDate);

  if (parsedDueDate === undefined) {
    return res.status(400).json({
      message: "Invalid due date"
    })
  }

  const normalizedTags = Array.isArray(tags) ? tags : [];

  const todo = await createTodo({
    title,
    description,
    completed: false,
    dueDate: parsedDueDate,
    user: {
      connect: { id: existedUser.id }
    },
    tags: {
    connectOrCreate: normalizedTags.map((tag: string) => ({
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

const updateTodo = async(req: Request, res: Response) => {
  const id = Number(req.params.id)

  const {
    title,
    description,
    completed,
    tags,
    dueDate
  } = req.body

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid ID"
    })
  }

  try {
    const parsedDueDate = parseDueDate(dueDate);

    if (parsedDueDate === undefined && dueDate !== undefined) {
      return res.status(400).json({
        message: "Invalid due date"
      })
    }

    const todo = await findTodoAndUpdate(id, {
      title,
      description,
      completed,
      ...(dueDate !== undefined && { dueDate: parsedDueDate }),
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
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      })
    }

    return res
      .status(200)
      .json({
        message: "Todo deleted successfully",
        todo
      })
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
