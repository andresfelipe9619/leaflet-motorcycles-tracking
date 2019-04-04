const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const { Client, Query } = require("pg");
const { getParadas, getConductores, getClientes } = require("./db/queries");
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

const doQuery = (mQuery, callback) => {
  let client = new Client(conString);
  client.connect();
  let query = client.query(new Query(mQuery));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    callback(result.rows[0].json_build_object);
  });
};

router.get("/paradas", (req, res) => {
  doQuery(getParadas, result => {
    res.json(result);
    res.end();
  });
});

router.get("/conductores", (req, res) => {
  doQuery(getConductores, result => {
    res.json(result);
    res.end();
  });
});

router.get("/clientes", (req, res) => {
  doQuery(getClientes, result => {
    res.json(result);
    res.end();
  });
});

router.get("/ruta_parada", (req, res) => {
  doQuery(getRutaParada, result => {
    res.json(result);
    res.end();
  });
});

router.get("/ruta_destino", (req, res) => {
  doQuery(getClientes, result => {
    res.json(result);
    res.end();
  });
});

router.get("/paradas_buffer", (req, res) => {
  let { buffer, currentLocation } = req.query;
  console.log('{buffer, currentLocation}', {buffer, currentLocation})
});

app.use(router);
app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});

module.exports = router;
