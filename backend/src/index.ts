import "dotenv/config"
import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import "./oauth/google.strategy.js"
import passport from "passport"

let app = express()
app.set("trust proxy", 1)
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL!,
]
app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true)
      }
      if (
        origin &&
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true)
      }
      return callback(null, false)
    },

    credentials: true,
  })
)

app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({
    message: "working"
  })
})

import userRouter from './routes/user.routes.js'
import todoRouter from './routes/todo.routes.js'
import authRoutes from "./routes/auth.routes.js"



app.use('/user', userRouter)
app.use('/todo', todoRouter)
app.use('/auth', authRoutes)



const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, (error?: NodeJS.ErrnoException) => {
  if (error) {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the existing server using port ${PORT}, then run npm run dev again.`
      )
    } else if (error.code === "EPERM") {
      console.error(
        `Permission denied while opening port ${PORT}. Run the server in a normal terminal or free/retry port ${PORT}.`
      )
    } else {
      console.error(`Failed to start server on port ${PORT}`, error)
    }
    process.exit(1)
  }
  console.log(`Server running on port ${PORT}`)
})
