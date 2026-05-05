import "dotenv/config";
import express from 'express'
import cors from "cors"
let app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ limit: "16kb" }))

app.get('/', (req, res) => {
  res.json({
    message: "hello"
  })
})

import userRouter from './routes/user.routes.js'
import todoRouter from './routes/todo.routes.js'


app.use('/user', userRouter)
app.use('/todo', todoRouter)



app.listen(3000)
