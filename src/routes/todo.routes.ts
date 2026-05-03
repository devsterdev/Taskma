import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addTodo } from "../controller/todo.controller.js";


const router = Router()

router.route('/add').post(verifyJWT, addTodo)

export default router