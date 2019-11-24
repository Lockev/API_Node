const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // RESET DE TOUTES LES TABLES DE LA BDD
  req.sql.query("TRUNCATE FROM employees"),
    req.sql.query("TRUNCATE FROM clients"),
    req.sql.query("TRUNCATE FROM projects"),
    (error, result) => {
      res.json({
        status: "success"
      });
    };
});
