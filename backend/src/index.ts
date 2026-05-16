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



const PORT = Number(process.env.PORT) || 3000;
const HOST =
  process.env.HOST ||
  (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");

app.listen(PORT, HOST, (error?: NodeJS.ErrnoException) => {
  if (error) {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the existing server using port ${PORT}, then run npm run dev again.`
      );
    } else if (error.code === "EPERM") {
      console.error(
        `Permission denied while opening ${HOST}:${PORT}. Run the server in a normal terminal or free/retry port ${PORT}.`
      );
    } else {
      console.error(`Failed to start server on ${HOST}:${PORT}`, error);
    }

    process.exit(1);
  }

  console.log(`Server running on http://${HOST}:${PORT}`);
})
