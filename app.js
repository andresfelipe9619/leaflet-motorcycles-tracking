const express = require("express"); // require Express
const router = express.Router(); // setup usage of the Express router engine
const app = express();
/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require("pg");

// Setup connection
const username = "docker"; // sandbox username
const password = "docker"; // read only privileges on our table
const host = "localhost:25432";
const database = "mototrip"; // database name
const conString =
  "postgres://" + username + ":" + password + "@" + host + "/" + database; // Your Database Connection

// Set up your database query to display GeoJSON
const coffee_query =
  "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, nombre)) As properties FROM clientes As lg) As f) As fc";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET Postgres JSON data */
router.get("/data", function(req, res) {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(coffee_query));
  query.on("row", function(row, result) {
    result.addRow(row);
  });
  query.on("end", function(result) {
    res.send(result.rows[0].row_to_json);
    res.end();
  });
});

app.use(router);
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

module.exports = router;
