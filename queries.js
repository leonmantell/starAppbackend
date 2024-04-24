const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});
console.log({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
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

//Get users

const getUser = (request, response) => {
  console.log(request);
  pool.query("SELECT * FROM users where isadmin = false", (error, results) => {
    console.log({ error, results });
    if (error) {
      console.error("Error searching for email in the database:", error);
    } else {
      response.status(200).send({
        status: true,
        users: results.rows,
      });
    }
  });
};
//get infor matching email
const getinfo = (request, response) => {
  pool.query(
    "SELECT * FROM users where email = $1",
    [request.body.email],
    (error, results) => {
      if (error) {
        console.error("Error searching for email in the database:", error);
      } else {
        if (results.rows.length > 0) {
          response.status(200).send({
            status: true,
            email: results.rows[0].email,
            name: results.rows[0].name,
            isAdmin: results.rows[0].isadmin,
          });
        }
      }
    }
  );
};

//log in page

const login = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  console.log({ email, password });

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).json({
          message:
            "An error occurred while searching for email in the database",
        });
      }
      try {
        if (results.rows.length > 0) {
          const storedPassword = results.rows[0].password;
          if (password === storedPassword) {
            if (results.rows[0].isadmin) {
              console.log(results.rows[0]);
              response.status(200).send({
                status: true,
                isAdmin: true,
                userName: results.rows[0].name,
                msg: `Log in admin.`,
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
      } catch (error_) {
        console.error("Error searching for email in the database:", error_);
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
  getUser,
  resetUser,
  getinfo,
};
