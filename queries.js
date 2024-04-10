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
  const email = request.body.email
  const password = request.body.password

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    console.log(results);
    try
     {
      if (results.rows.length > 0) {
        // Email found in the database, compare passwords
        const storedPassword = results.rows[0].password;
        if (password === storedPassword) {
          // Password match, sign-in success
          response.status(200).json({ message: 'Sign-in successful' });
        } else if(password !== storedPassword ) {
          // Invalid password
          response.status(401).json({ message: 'Invalid password' });
        } else {
          response.status(404).json({ message: 'Email not found in the database'});
        } 
      }
     }
    catch (error){
      console.error('Error searching for email in the database:', error);
      response.status(500).json({ message: 'An error occurred while searching for email in the database' });
    }
  })
}
// Creating new user

const createUser = (request, response) => {
  const { email, name, password} = request.body

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
    if (error) {
      throw error;
    }

    if (result.rows.length > 0) {
      // Email already exists in the database, send an error response
      response.status(400).send('Email already exists in the database');
    } else {
      // Email is unique, proceed with inserting the new user data
      pool.query('INSERT INTO users (email, name, password) VALUES ($1, $2, $3)', [email, name, password], (err, results) => {
        if (err) {
          throw err;
        }
        response.status(201).send(`User added with Email: ${results.email}`);
      });
    }
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.email)
  const { name, email, password } = request.body

  pool.query(
    'UPDATE users SET name = $1, password = $2 WHERE email = $3',
    [email, name, password],
    (error, results) => {
      if (error) {                 
        throw error
      }
      response.status(200).send(`As a result, User modified with email: ${email}`)
    }
  )
}

const deleteUser = (request, response) => {

  const email = request.params.email

  pool.query('DELETE FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`As a result, User deleted with email: ${email}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}