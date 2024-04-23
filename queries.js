const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "myApp",
  password: "222331",
  port: 5432,
});

//reset
const resetUser = (request, response) => {
  const email = request.body.email;

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      try {
        if (results.rows.length > 0) {
          // Email found in the database,
          response.status(200).send({
            status: true,
            msg: `reset successfully.`,
          });
        } else {
          response.status(400).send({
            status: false,
            msg: `reset failed.`,
          });
        }
      } catch (error) {
        console.error("Error searching for email in the database:", error);
        response.status(500).json({
          message:
            "An error occurred while searching for email in the database",
        });
      }
    }
  );
};

//Get Admins

const getAdmin = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error searching for email in the database:", error);
    } else {
      console.log(results.rows);
      response.status(200).send({
        status: true,
        users: results.rows,
      });
    }
  });
};
//log in page

const login = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      try {
        console.log(results.rows.password);
        if (results.rows.length > 0) {
          const storedPassword = results.rows[0].password;
          if (password === storedPassword) {
            if (results.rows[0].isadmin) {
              response.status(200).send({
                status: true,
                isAdmin: true,
                msg: `Log in successfully.`,
              });
            } else
              response.status(200).send({
                status: true,
                isAdmin: false,
                msg: `Log in successfully.`,
              });
          } else if (password !== storedPassword) {
            // Invalid password
            response.status(201).send({
              staus: false,
              msg: `Password is incorrect.`,
            });
          }
        } else {
          response
            .status(404)
            .json({ message: "Email not found in the database" });
        }
      } catch (error) {
        console.error("Error searching for email in the database:", error);
        response.status(500).json({
          message:
            "An error occurred while searching for email in the database",
        });
      }
    }
  );
};
// Creating new user
const createUser = (request, response) => {
  const { email, name, password } = request.body;

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, result) => {
      if (error) {
        throw error;
      }
      if (result.rows.length > 0) {
        // Email already exists in the database, send an error response
        response.status(200).send({
          status: false,
          msg: "Email already exists in the database",
        });
      } else {
        // Email is unique, proceed with inserting the new user data
        pool.query(
          "INSERT INTO users (email, name, password) VALUES ($1, $2, $3)",
          [email, name, password],
          (err, results) => {
            if (err) {
              throw err;
            }
            response.status(201).send({
              status: true,
              msg: `User added with Email: ${email}`,
            });
          }
        );
      }
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.email);
  const { name, email, password } = request.body;

  pool.query(
    "UPDATE users SET name = $1, password = $2 WHERE email = $3",
    [email, name, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`As a result, User modified with email: ${email}`);
    }
  );
};

const deleteUser = (request, response) => {
  const email = request.params.email;

  pool.query(
    "DELETE FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`As a result, User deleted with email: ${email}`);
    }
  );
};

module.exports = {
  login,
  createUser,
  updateUser,
  deleteUser,
  getAdmin,
  resetUser,
};
