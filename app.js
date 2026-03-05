// Import the express module
import express from "express";

// essential for connecting datebase.
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Loads the environment vars from .env file.
dotenv.config();

// Database connection pool.
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

// Create an instance of an Express application
const app = express();

app.set('view engine', 'ejs')

// Define the port number where our server will listen
const PORT = 3011;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
const orders = [];



// Define a default "route" ('/')
app.get("/", (req, res) => {
  res.render('home');
});

app.post('/submit-order',async (req, res) => {
  const order = {
    name: req.body.name,
    email: req.body.email,
    cone: req.body.cone,
    flavor: req.body.flavor,
    toppings: req.body.toppings,
    comment: req.body.comment,
    timestamp: new Date()
  }

  let stringToppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";
  const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) VALUES (?, ?, ?, ?, ?);`;
  const params = [ order.name, order.email, order.cone, order.flavor];
  try {

  
  const result = await pool.execute(sql, params);
  console.log('order saved with ID:', result[0].insertId);
  orders.push(order);
  res.render('confirmation', { order })
  } catch (err) {
    console.error('error savings order:', err);
    res.status(500).send('sorry, there was an error processing your order. Please try again.');
  }
})


app.get('/admin', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');

    res.render('admin', { orders });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Error loading orders: ' + err.message);
  }
});

app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

app.get('/db-test', async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders;');
    res.send(orders[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
