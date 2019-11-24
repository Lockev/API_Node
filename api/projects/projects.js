const express = require("express");
const routerProjects = express.Router();

routerProjects.get("/", (req, res) => {
  if (req.query.name !== undefined) {
    // API De recherche d'un projet
    req.sql.query("SELECT * FROM projects WHERE name='" + req.query.name + "'", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));
      res.json({
        name: data[0].name,
        "proposed by": data[0].client,
        budget: data[0].budget,
        employee: data[0].employee
      });
    });
  } else {
    // API De recherche de tous les projets
    req.sql.query("SELECT * FROM projects", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele.name));
      res.json({
        projects: data
      });
    });
  }
});

routerProjects.post("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == undefined) {
    missingInfo.push("name");
  }
  if (req.body.client == undefined) {
    missingInfo.push("client");
  }
  if (req.body.employee == undefined) {
    missingInfo.push("employee");
  }
  if (req.body.budget == undefined) {
    missingInfo.push("budget");
  }
  if (missingInfo.length == 0) {
    req.sql.query(
      "INSERT INTO projects SET name = ?, client = ?, employee = ?, budget = ?",
      [req.body.name, req.body.client, req.body.employee, req.body.budget],
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

routerProjects.put("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name !== undefined) {
    // On check que l'on a un nom
    req.sql.query("SELECT * FROM projects WHERE name='" + req.body.name + "'", [req.body.name], (error, result) => {
      // On récupère les données de la ligne avant de la modifier
      let data = [];
      result.map(ele => data.push(ele));

      // On verifie que le nom donné a été trouvé dans la BDD
      if (data[0] !== undefined) {
        // Le nom a été trouvé, on effectue la requete
        let fullQuery = "UPDATE projects SET";

        if (req.body.client !== undefined) {
          // On vérifie si le nom du client est modifié
          fullQuery += " client='" + req.body.client + "',";
        } else {
          fullQuery += " client='" + data[0].client + "',";
        }

        if (req.body.employee !== undefined) {
          // On vérifie si l'employé lié au projet est modifié
          fullQuery += " employee='" + req.body.employee + "',";
        } else {
          fullQuery += " employee='" + data[0].employee + "',";
        }

        if (req.body.budget !== undefined) {
          // On vérifie si le budget est modifié
          fullQuery += " budget='" + req.body.budget + "'";
        } else {
          fullQuery += " budget='" + data[0].budget + "'";
        }

        fullQuery += " WHERE name='" + req.body.name + "'";
        req.sql.query(fullQuery, [req.body.name, req.body.client, req.body.employee, req.body.budget], (error, result) => {
          res.json({
            status: "success",
            data: data
          });
        });
      }
      // Si le nom donné n'est pas trouvé en BDD
      else {
        res.json({
          status: "failure",
          reason: "name given is not in database"
        });
      }
    });
  } else {
    // On throw une erreur si aucun nom n'a été donné
    missingInfo.push("name");
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

routerProjects.delete("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == undefined) {
    missingInfo.push("name");
  }
  if (missingInfo.length == 0) {
    // On verifie que le nom donné a été trouvé dans la BDD
    req.sql.query("SELECT * FROM projects WHERE name='" + req.body.name + "'", [req.body.name], (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));

      if (data[0] !== undefined) {
        // Le nom a été trouvé, on effectue la requete
        req.sql.query("DELETE FROM projects WHERE name='" + req.body.name + "'", (error, result) => {
          res.json({
            status: "success"
          });
        });

        // Si le nom donné n'est pas trouvé en BDD
      } else {
        res.json({
          status: "failure",
          reason: "name given is not in database"
        });
      }
    });
  } else {
    res.json({
      status: "failure",
      error: "Missing info: " + missingInfo.join(", ")
    });
  }
});

module.exports = routerProjects;
