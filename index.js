const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})


app.post('/', function (req, res) {
    res.send('Hello Arman')
  })

app.listen(4000)