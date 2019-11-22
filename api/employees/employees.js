const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // API De recherche des utilisateurs
  req.sql.query("SELECT * FROM book", (error, result) => {
    let data = [];
    result.map(ele => data.push(ele.title));
    res.json({
      title: data
    });
  });
});

router.post("/", (req, res) => {
  req.sql.query(
    "INSERT INTO book SET title = ?, author = ?, description = ?, price = ?, stock = ?",
    [req.body.title, req.body.author, req.body.description, req.body.price, req.body.stock],
    (error, data) => {
      req.sql.query("SELECT * FROM book WHERE id = ?", [data.insertId], (error, data) => {
        resp_data = {};
        resp_data.test = data;
        res.json(resp_data);
      });
    }
  );
});

module.exports = router;
