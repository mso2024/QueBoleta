const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Replace with your DB host
  user: 'root',      // Replace with your DB username
  password: 'canela172006', // Replace with your DB password
  database: 'QueBoleta',    // Replace with your database name
});

module.exports = pool.promise();
