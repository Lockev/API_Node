require("dotenv").config(); // Récupère le fichier .env

const mysql = require("mysql2");

let connection = mysql.createConnection({
  // Exploite la data du .env pour se connecter
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //   debug: false,
  dateStrings: true
});

connection.connect(err => {
  if (err) throw err;
});

module.exports = connection;
