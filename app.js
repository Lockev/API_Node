const express = require("express");
const path = require("path");
const sql = require("./db");
const bodyParser = require("body-parser");

const app = express();

//Rend la db accessible au router
app.use((req, res, next) => {
  req.sql = sql;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply routes to App
const version = "/api/";
const employeesRouter = require("./api/employees/employees");
app.use(version + "employees/", employeesRouter);

// const clientsRouter = require("./api/clients/clients");
// app.use(version + "clients/", clientsRouter);

// const projectsRouter = require("./api/projects/projects");
// app.use(version + "projects/", projectsRouter);

// const projectsRouter = require("./api/reset/reset");
// app.use(version + "reset/", projectsRouter);

// Exporte app vers tout les autres fichiers
module.exports = app;
