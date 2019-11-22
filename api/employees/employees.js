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
  let missingInfo = [];
  if (req.body.name == null) {
    missingInfo.push("name");
  }
  if (req.body.salary == null) {
    missingInfo.push("salary");
  }
  if (req.body.seniority == null) {
    missingInfo.push("seniority");
  }
  if (missingInfo.length == 0) {
    req.sql.query(
      "INSERT INTO employees SET name = ?, salary = ?, seniority = ?",
      [req.body.name, req.body.salary, req.body.seniority],
      (error, result) => {
        res.json({
          status: "success"
        });
      }
    );
  } else {
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

router.delete("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == null) {
    missingInfo.push("name");
  }
  if (missingInfo.length == 0) {
    req.sql.query("DELETE FROM employees WHERE name='" + req.body.name + "'", (error, result) => {
      res.json({
        status: "success"
      });
    });
  } else {
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

module.exports = router;
