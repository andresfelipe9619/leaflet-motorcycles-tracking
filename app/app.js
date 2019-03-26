const express = require("express"); //
const router = express.Router(); //
const path = require("path");
const app = express();
/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require("pg");

// Setup connection
const username = "andressuarez"; // sandbox username
const password = ""; // read only privileges on our table
const host = "localhost:5432";
const database = "mototrip"; // database name
const conString =
  "postgres://" + username + "@" + host + "/" + database; // Your Database Connection

// Set up your database query to display GeoJSON
const coffee_query =
  "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, nombre)) As properties FROM '17_conductores_mototrip_wgs84' As lg) As f) As fc";

// app.use(express.static(path.join(__dirname, "./static")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
/* GET Postgres JSON data */
router.get("/data", (req, res) => {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(coffee_query));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    res.json(result.rows[0].row_to_json);
    // res.end();
  });
});

app.use(router);
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

module.exports = router;
