const { Client, Query } = require("pg");

const username = "andressuarez";
const password = "";
const database = "mototrip";
const host = "localhost:5432";
const conString =
  "postgres://" + username + ":" + password + "@" + host + "/" + database;

const selectQuery = entity =>
  ` SELECT json_build_object(
    'type', 'FeatureCollection',
    
    'features', json_agg(
        json_build_object(
            'type',       'Feature',
            'id',         id,
            'geometry',   ST_AsGeoJSON(ST_ForceRHR(st_transform(geom,4326)))::json,
            'properties', jsonb_set(row_to_json(${entity})::jsonb,'{geom}','0',false)
        )
    )
    )
    FROM ${entity};
   `;

const getParadas = selectQuery("paradas_mototrip_wgs");
const getConductores = selectQuery("conductores_mototrip_wgs84");
const getClientes = selectQuery("clientes_mototrip_wgs84");

const getRutaParada = `
SELECT seq, id1 AS node, id2 AS edge, cost, b.geom FROM pgr_dijkstra('
SELECT gid AS id,
         source::integer,
         target::integer,
         costo::double precision AS cost
        FROM vias_wgs84',
(select o.id::integer from (
select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,clientes_mototrip_wgs84.geom)
from  vias_wgs84_vertices_pgr,clientes_mototrip_wgs84 WHERE clientes_mototrip_wgs84.id= '1' ORDER BY 2 ASC LIMIT 1 )as o),
(select d.id ::integer from (select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,paradas_mototrip_wgs.geom)
from  vias_wgs84_vertices_pgr,paradas_mototrip_wgs WHERE paradas_mototrip_wgs.id= '5' order by 2 asc limit 1  )as d), false, false) 
a LEFT JOIN vias_wgs84 b ON (a.id2 = b.gid)`;

const getParadasBuffer = (point, bufer) =>
  point &&
  bufer &&
  `
select gid,nombre,st_distance(ST_GeometryFromText('POINT(${point.lat} ${
    point.lon
  })',4326),p.geom) as distancia
from paradas_mototrip p
where st_intersects(p.geom,ST_buffer(ST_GeometryFromText('POINT(${point.lat} ${
    point.lon
  })',4326),${bufer}))
`;

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
    callback(result.rows[0].json_build_object || result.rows);
  });
};

module.exports = {
  doQuery,
  loginUsuario,
  getParadas,
  getClientes,
  getConductores,
  getRutaParada,
  getParadasBuffer
};
