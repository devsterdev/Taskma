import "dotenv/config";
import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import "./oauth/google.strategy.js"
import passport from "passport";

let app = express();
app.set("trust proxy", 1)
app.use(cookieParser())
app.use(passport.initialize());

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json({ limit: "16kb" }))

app.get('/', (req, res) => {
  res.json({
    message: "working"
  })
})

import userRouter from './routes/user.routes.js'
import todoRouter from './routes/todo.routes.js'
import authRoutes from "./routes/auth.routes.js";



app.use('/user', userRouter)
app.use('/todo', todoRouter)
app.use('/auth', authRoutes)



app.listen(3000)
