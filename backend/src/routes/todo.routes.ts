import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addTodo, deleteTodo, getTodo, updateTodo } from "../controller/todo.controller.js";


const router = Router()

router.route('/add').post(verifyJWT, addTodo)
router.route('/read').get(verifyJWT, getTodo)
router.route('/update/:id').patch(verifyJWT, updateTodo)
router.route('/delete/:id').delete(verifyJWT, deleteTodo)

export default router