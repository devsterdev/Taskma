import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";


const router = Router()

router.route("/register").post(registerUser)

router.get('/register', (req, res) => {
  res.send('GET works')
})

export default router