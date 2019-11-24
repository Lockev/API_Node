const express = require("express");
const routerClients = express.Router();

routerClients.get("/", (req, res) => {
  if (req.query.name !== undefined) {
    // API De recherche d'un client
    req.sql.query("SELECT * FROM clients WHERE name='" + req.query.name + "'", (error, result) => {
      let data = [];
      result.map(ele => data.push(ele));
      req.sql.query("SELECT name FROM projects WHERE client='" + req.query.name + "'", (error, result) => {
        let data2 = [];
        result.map(ele => data2.push(ele.name));
        res.json({
          name: data[0].name,
          proposed: data2,
          contact: data[0].contact
        });
      });
    });
  } else {
    // API De recherche de tous les clients
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
  if (req.body.name == undefined) {
    missingInfo.push("name");
  }
  if (req.body.contact == undefined) {
    missingInfo.push("contact");
  }
  if (missingInfo.length == 0) {
    req.sql.query("INSERT INTO clients SET name = ?, contact = ?", [req.body.name, req.body.contact], (error, result) => {
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

routerClients.put("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name !== undefined) {
    // On check que l'on a un nom
    req.sql.query("SELECT * FROM clients WHERE name='" + req.body.name + "'", [req.body.name], (error, result) => {
      // On verifie que le nom donné a été trouvé dans la BDD
      let data = [];
      result.map(ele => data.push(ele));

      if (data[0] !== undefined) {
        // Le nom a été trouvé, on effectue la requete
        if (req.body.contact !== undefined) {
          // Si on n'update pas le contact
          req.sql.query(
            "UPDATE clients SET contact = '" + req.body.contact + "' WHERE name='" + req.body.name + "'",
            [req.body.name, req.body.contact],
            (error, result) => {
              res.json({
                status: "success"
              });
            }
          );
        }
        // Si le nom donné n'est pas trouvé en BDD
      } else {
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

routerClients.delete("/", (req, res) => {
  let missingInfo = [];
  if (req.body.name == undefined) {
    missingInfo.push("name");
  }
  if (missingInfo.length == 0) {
    req.sql.query("SELECT * FROM clients WHERE name='" + req.body.name + "'", [req.body.name], (error, result) => {
      // On verifie que le nom donné a été trouvé dans la BDD
      let data = [];
      result.map(ele => data.push(ele));

      if (data[0] !== undefined) {
        // Le nom a été trouvé, on effectue la requete
        req.sql.query("DELETE FROM clients WHERE name='" + req.body.name + "'", (error, result) => {
          req.sql.query("DELETE FROM projects WHERE client='" + req.body.name + "'", (error, result) => {
            res.json({
              status: "success"
            });
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

module.exports = routerClients;
