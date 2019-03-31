const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const { Client, Query } = require("pg");
const { getParadas, getConductores } = require("./db/queries")
const username = "andres";
const password = "andres";
const database = "mototrip";
const host = "localhost:5432";
const conString =
  "postgres://" + username + ":" + password + "@" + host + "/" + database;


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

router.get("/paradas", (req, res) => {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(getParadas));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

router.get("/conductores", (req, res) => {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(getConductores));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

app.use(router);
app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});

module.exports = router;
