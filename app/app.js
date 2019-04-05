const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const {
  doQuery,
  getParadas,
  getConductores,
  getClientes,
  getParadasBuffer,
  loginUsuario
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
  let { buffer, latitud, longitud } = req.query;
  let point = { lat: latitud, lon: longitud };
  let query = getParadasBuffer(point, buffer);
  doQuery(query, result => {
    res.json(result);
    res.end();
  });
});

app.use(router);
app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});

module.exports = router;
