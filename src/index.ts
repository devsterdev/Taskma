import express from 'express'

let app = express();

app.get('/', (req, res) => {
  res.json({
    message: "hello"
  })
})

app.listen(3000)