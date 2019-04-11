const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3001;
const {
  doQuery,
  getVias,
  getParadas,
  getClientes,
  loginUsuario,
  getRutaParada,
  getConductores,
  getRutaDestino,
  getParadasBuffer,
  getPrecioDestino
} = require("./db/queries");
let currentUser = null;
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

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
  // res.sendFile(path.join(__dirname, "public/login.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});
app.get("/currentUser", (req, res) => {
  res.json(currentUser);
});
app.post("/login", (req, res) => {
  let login = req.body.login;
  let [usuario, contraseña] = login;
  let query = loginUsuario(usuario, contraseña);
  doQuery(query, result => {
    console.log("result", result);
    if (result.length > 0) {
      currentUser = result[0];
      return res.sendFile(path.join(__dirname, "public/index.html"));
    } else {
      return res.sendFile(path.join(__dirname, "public/login_error.html"));
    }
  });
});
app.use(express.static(path.join(__dirname, "public")));

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
  let query = getRutaParada(point, parada);
  doQuery(query, result => {
    res.json(result);
    res.end();
  });
});

router.get("/ruta_destino", (req, res) => {
  let { parada, latitude, longitude } = req.query;
  let destino = { lat: latitude, lon: longitude };
  let queryruta = getRutaDestino(destino, parada);
  let queryprecio = getPrecioDestino(destino, parada);
  doQuery(queryruta, ruta => {
    doQuery(queryprecio, precio => {
      res.json({ ruta, precio: precio[0].precio });
      res.end();
    });
  });
});

router.get("/paradas_buffer", (req, res) => {
  let { buffer, latitude, longitude } = req.query;
  let point = { lat: latitude, lon: longitude };
  let query = getParadasBuffer(point, buffer);
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
