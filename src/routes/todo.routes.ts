import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addTodo, getTodo, updateTodo } from "../controller/todo.controller.js";


const router = Router()

router.route('/add').post(verifyJWT, addTodo)
router.route('/read').get(verifyJWT, getTodo)
router.route('/update/:id').patch(verifyJWT, updateTodo)

export default router