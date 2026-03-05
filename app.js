// Import the express module
import express from "express";

// essential for connecting datebase.
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Loads the enviorment vars from .env file.
dotenv.config();

// Database connection pool.
const pool = mysql2.createPool ({
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

app.post('/submit-order', (req, res) => {
  const order = {
    name: req.body.name,
    email: req.body.email,
    cone: req.body.cone,
    flavor: req.body.flavor,
    toppings: req.body.toppings,
    comment: req.body.comment,
    timestamp: new Date()
  }

  orders.push(order);
  res.render('confirmation', { order })
})

app.get('/admin', (req, res) => {
  res.render('admin', { orders });
});

app.get('/confirmation', (req, res) => {
  res.render('confirmation');
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
