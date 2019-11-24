const express = require("express");
const routerReset = express.Router();

routerReset.delete("/", (req, res) => {
  // RESET DE TOUTES LES TABLES DE LA BDD
  req.sql.query("TRUNCATE TABLE employees", (error, result) => {
    req.sql.query("TRUNCATE TABLE clients", (error, result) => {
      req.sql.query("TRUNCATE TABLE projects", (error, result) => {
        res.json({
          status: "success"
        });
      });
    });
  });
});

module.exports = routerReset;
