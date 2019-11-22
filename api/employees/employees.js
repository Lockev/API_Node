const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // API De recherche des utilisateurs
  req.sql.query("SELECT * FROM employees", (error, result) => {
    let data = [];
    result.map(ele => data.push(ele.name));
    res.json({
      name: data
    });
  });
});

router.post("/", (req, res) => {
  req.sql.query(
    "INSERT INTO employees SET name = ?, salary = ?, seniority = ?",
    [req.body.name, req.body.salary, req.body.seniority],
    (error, data) => {
      
    }
  );
});

module.exports = router;
