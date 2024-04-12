const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const db = require('./queries')
const port = 8000

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/users/reset', db.resetUser)
app.post('/users/login', db.login)
app.post('/users/signup', db.createUser)
app.put('/users/:email', db.updateUser)
app.delete('/users/:email', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})