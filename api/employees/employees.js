const express = require("express");
const routerEmployees = express.Router();

routerEmployees.get("/", (req, res) => {
  if (req.query.name !== undefined) {
    // API De recherche d'un employé
    req.sql.query("SELECT * FROM employees WHERE name='" + req.query.name + "'", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));
      req.sql.query("SELECT name FROM projects WHERE employee='" + req.query.name + "'", (error, result) => {
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
  if (req.body.name == undefined) {
    missingInfo.push("name");
  }
  if (req.body.salary == undefined) {
    missingInfo.push("salary");
  }
  if (req.body.seniority == undefined) {
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
  if (req.body.name !== undefined) {
    // On check que l'on a le nom
    req.sql.query("SELECT * FROM employees WHERE name='" + req.body.name + "'", [req.body.name], (error, result) => {
      // On récupère les données de la ligne avant de la modifier
      let data = [];
      result.map(ele => data.push(ele));

      let fullQuery = "UPDATE employees SET";

      if (req.body.seniority !== undefined) {
        // On vérifie si le nom du client est modifié
        fullQuery += " seniority='" + req.body.seniority + "',";
      } else {
        fullQuery += " seniority='" + data[0].seniority + "',";
      }

      if (req.body.salary !== undefined) {
        // On vérifie si l'employé lié au projet est modifié
        fullQuery += " salary='" + req.body.salary + "'";
      } else {
        fullQuery += " salary='" + data[0].salary + "'";
      }

      fullQuery += " WHERE name='" + req.body.name + "'";
      req.sql.query(fullQuery, [req.body.name, req.body.seniority, req.body.salary], (error, result) => {
        res.json({
          status: "success",
          query: fullQuery
        });
      });
    });
  } else {
    // On throw une erreur si on ne l'a pas
    missingInfo.push("name");
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

routerEmployees.delete("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == undefined) {
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
