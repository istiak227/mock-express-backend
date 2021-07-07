const express = require("express");
const app = express();
var db = require("./database.js");
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8000;

app.listen(port, () => {
  console.log("Express is runnis at this port");
});

app.get("/", (req, res) => {
  res.json({
    message: "OK",
  });
});

app.get("/api/users", (req, res, next) => {
  const sql = "select * from user";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/user/:id", (req, res, next) => {
  var sql = "select * from user where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

app.post("/api/user/", (req, res, next) => {
  var errors=[]
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password)
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})

app.use((req, res) => {
  res.status(404);
});
