import type { Request, Response } from "express"
import { findUserByUserId } from "../db/user.db.js"
import { createTodo } from "../db/todo.db.js"

const addTodo = async(req: Request, res: Response) => {
  const { title, description, completed } = req.body
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
    }
  })

  return res.status(201).json({
    message: "Todo created successfully",
    todo
  })
}

export {
  addTodo
}
