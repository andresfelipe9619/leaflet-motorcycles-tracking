const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3001;
const {
  doQuery,
  getParadas,
  getVias,
  getClientes,
  loginUsuario,
  getRutaParada,
  getConductores,
  getParadasBuffer,
  getRutaDestino
} = require("./db/queries");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});
app.post("/login", (req, res) => {
  let login = req.body.login;
  let [usuario, contraseña] = login;
  let estaRegistrado = loginUsuario(usuario, contraseña);
  if (estaRegistrado) {
    return res.sendFile(path.join(__dirname, "public/index.html"));
  }
  return res.sendFile(path.join(__dirname, "public/login.html"));
});

router.get("/paradas", (req, res) => {
  doQuery(getParadas, result => {
    res.json(result);
    res.end();
  });
});

router.get("/vias", (req, res) => {
  doQuery(getVias, result => {
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
  let { parada, latitude, longitude } = req.query;
  let point = { lat: latitude, lon: longitude };
  let query = getRutaParada(point, parada)
  console.log('query', query)
  doQuery(query, result => {
    res.json(result);
    res.end();
  });
});

router.get("/ruta_destino", (req, res) => {
  let { parada, latitude, longitude } = req.query;
  let destino = { lat: latitude, lon: longitude };
  let query = getRutaDestino(destino, parada);
  console.log('query_destino', query)
  doQuery(query, result => {
    res.json(result);
    res.end();
  });
});

router.get("/paradas_buffer", (req, res) => {
  let { buffer, latitude, longitude } = req.query;
  let point = { lat: latitude, lon: longitude };
  let query = getParadasBuffer(point, buffer);
  console.log("query", query);
  doQuery(query, result => {
    res.json(result);
    res.end();
  });
});

app.use(router);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = router;
