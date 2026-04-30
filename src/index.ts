import express from 'express'

let app = express();

app.use(express.json({limit: "16kb"}))

app.get('/', (req, res) => {
  res.json({
    message: "hello"
  })
})

import userRouter from './routes/user.routes.js'


app.use('/user', userRouter)



app.listen(3000)