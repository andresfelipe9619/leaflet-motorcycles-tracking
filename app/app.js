const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const { Client, Query } = require("pg");

const username = "andres";
const password = "andres";
const database = "mototrip";
const host = "localhost:5432";
const conString =
  "postgres://" + username + ":" + password + "@" + host + "/" + database;

const mototripQuery =
  "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, nombre, barrio)) As properties FROM paradas_mototrip_wgs As lg) As f) As fc;";

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
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./static", "index.html"));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
/* GET Postgres JSON data */
router.get("/data", (req, res) => {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(mototripQuery));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

app.use(router);
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

module.exports = router;
