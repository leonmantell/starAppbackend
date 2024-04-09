const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'myApp',
  password: '222331',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { email, name, password, user_id} = request.body

  pool.query('INSERT INTO users (email, name, password, user_id) VALUES ($1, $2, $3, $4)', [email, name, password, user_id], (error, results) => {
    if (error) {
      throw error
    }

    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email, password, user_id } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3 WHERE user_id = $4',
    [name, email, password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`As a result, User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`As a result, User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}