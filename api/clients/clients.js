const express = require("express");
const routerClients = express.Router();

routerClients.get("/", (req, res) => {
  if (req.body.name !== null) {
    // API De recherche d'un employé
    req.sql.query("SELECT * FROM clients WHERE name='" + req.body.name + "'", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));
      req.sql.query("SELECT name FROM projects WHERE client='" + req.body.name + "'", (error, result) => {
        let data2 = [];
        result.map(ele => data2.push(ele.client));
        res.json({
          data: data
          //   name: data[0].name,
          //   proposed: data2,
          //   contact: data[0].contact
        });
      });
    });
  } else {
    // API De recherche de tous les employés
    req.sql.query("SELECT * FROM clients", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele.name));
      res.json({
        name: data
      });
    });
  }
});

routerClients.post("/", (req, res) => {
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

routerClients.put("/", (req, res) => {
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

routerClients.delete("/", (req, res) => {
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

module.exports = routerClients;
