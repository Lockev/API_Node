const express = require("express");
const routerEmployees = express.Router();

routerEmployees.get("/", (req, res) => {
  if (req.body.name !== null) {
    // API De recherche d'un employé
    req.sql.query("SELECT * FROM employees WHERE name='" + req.body.name + "'", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));
      req.sql.query("SELECT name FROM projects WHERE employee='" + req.body.name + "'", (error, result) => {
        let data2 = [];
        result.map(ele => data2.push(ele.name));
        res.json({
          name: data[0].name,
          "projects done": data2.length,
          "working on": data2,
          salary: data[0].salary,
          seniority: data[0].seniority
        });
      });
    });
  } else {
    // API De recherche de tous les employés
    req.sql.query("SELECT * FROM employees", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele.name));
      res.json({
        name: data
      });
    });
  }
});

routerEmployees.post("/", (req, res) => {
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

routerEmployees.put("/", (req, res) => {
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
      "UPDATE employees SET salary ='" + req.body.salary + "', seniority = '" + req.body.seniority + "' WHERE name='" + req.body.name + "'",
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

routerEmployees.delete("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == null) {
    missingInfo.push("name");
  }
  if (missingInfo.length == 0) {
    req.sql.query("DELETE FROM employees WHERE name='" + req.body.name + "'", (error, result) => {
      req.sql.query("DELETE FROM projects WHERE employee='" + req.body.name + "'", (error, result) => {
        res.json({
          status: "success"
        });
      });
    });
  } else {
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

module.exports = routerEmployees;
