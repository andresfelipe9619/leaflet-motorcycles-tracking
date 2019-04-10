const { Client, Query } = require("pg");

const username = "andressuarez";
const password = "";
const database = "mototrip";
const host = "localhost:5432";
const conString =
  "postgres://" + username + ":" + password + "@" + host + "/" + database;

const selectQuery = (entity, subquery, id) =>
  ` SELECT json_build_object(
    'type', 'FeatureCollection',
    
    'features', json_agg(
        json_build_object(
            'type',       'Feature',
            'id',         ${id || "id"},
            'geometry',   ST_AsGeoJSON(ST_ForceRHR(st_transform(geom,4326)))::json,
            'properties', jsonb_set(row_to_json(${subquery ? "resultado" : entity})::jsonb,'{geom}','0',false)
        )
    )
    )
    FROM ${subquery ? `(${subquery}) resultado` : entity};
   `;

const getParadas = selectQuery("paradas_mototrip_wgs");
const getConductores = selectQuery("conductores_mototrip_wgs84");
const getClientes = selectQuery("clientes_mototrip_wgs84");
const getVias = selectQuery("vias3115", null, "gid");

const getRutaParada = (point, parada) => {

  let subquery = `
  SELECT seq,id1 as node, id2 as edge, cost, b.geom FROM pgr_dijkstra('
  SELECT gid AS id,
  source::integer,
  target::integer,
  costo::double precision AS cost
  FROM vias_wgs84',(select o.id::integer from (select vias_wgs84_vertices_pgr.id,st_distance(vias_wgs84_vertices_pgr.the_geom,
  st_geometryFromtext('POINT( ${point.lon} ${point.lat})',4326)) from vias_wgs84_vertices_pgr order by st_distance LIMIT 1 ) as o),
  (select d.id ::integer from (select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,paradas_mototrip_wgs.geom)
  from vias_wgs84_vertices_pgr,paradas_mototrip_wgs WHERE paradas_mototrip_wgs.id= '${parada}' order by 2 asc limit 1 )as d), false, false) 
  a LEFT JOIN vias_wgs84 b ON (a.id2 = b.gid)
  `
  return selectQuery(null, subquery, "seq")
};

const getRutaDestino = (point, destino) => {

  let subquery = `
SELECT seq, id1 AS node, id2 AS edge, cost, b.geom FROM pgr_dijkstra('
SELECT gid AS id,
         source::integer,
         target::integer,
         costo::double precision AS cost
        FROM vias_wgs84',(select o.id::integer from (select vias_wgs84_vertices_pgr.id,st_distance(vias_wgs84_vertices_pgr.the_geom,
        st_geometryFromtext('POINT(${point.lat} ${
    point.lon
    })',4326)) from vias_wgs84_vertices_pgr order by st_distance LIMIT 1 ) as o),
(select d.id ::integer from (select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,paradas_mototrip_wgs.geom)
from  vias_wgs84_vertices_pgr,paradas_mototrip_wgs WHERE paradas_mototrip_wgs.id= '${destino}' order by 2 asc limit 1  )as d), false, false) 
a LEFT JOIN vias_wgs84 b ON (a.id2 = b.gid)`
  return selectQuery(null, subquery, "seq")
};

const getParadasBuffer = (point, bufer) => {
  if (!point && !bufer) return;
  let subquery = `
select p.id, p.nombre, p.geom,st_distance(ST_GeometryFromText('POINT(${point.lat} ${
    point.lon
    })',4326),p.geom) as distancia
from paradas_mototrip_wgs p
where st_intersects(p.geom,ST_buffer(ST_GeometryFromText('POINT(${point.lat} ${
    point.lon
    })',4326),${bufer}))
`
  return selectQuery(null, subquery)
};

const loginUsuario = (usuario, contraseña) => {
  if (usuario && contraseña) {
    if (usuario == "andres") return true;
  }
  return false;
};

const doQuery = (mQuery, callback) => {
  let client = new Client(conString);
  client.connect();
  let query = client.query(new Query(mQuery));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", result => {
    if (result.rows) {
      let res =
        (result.rows[0] && result.rows[0].json_build_object) || result.rows;
      callback(res);
    } else {
      console.log("RESULT HAS NOT ROWS", result);
    }
  });
};

module.exports = {
  doQuery,
  getVias,
  getParadas,
  getClientes,
  loginUsuario,
  getRutaParada,
  getConductores,
  getParadasBuffer,
  getRutaDestino
};
