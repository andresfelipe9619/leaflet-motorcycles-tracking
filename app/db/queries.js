const selectQuery = (entity, props) =>
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
select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,cliente.geom)
from  vias_wgs84_vertices_pgr,cliente WHERE cliente.cifcl= '1' ORDER BY 2 ASC LIMIT 1 )as o),
(select d.id ::integer from (select vias_wgs84_vertices_pgr.id, st_distance(vias_wgs84_vertices_pgr.the_geom,concesionario.geom)
from  vias_wgs84_vertices_pgr,concesionario WHERE concesionario.cifc= '5' order by 2 asc limit 1  )as d), false, false) 
a LEFT JOIN vias_wgs84 b ON (a.id2 = b.gid)`;
const getParadasBuffer = null;
module.exports = {
  getParadas,
  getClientes,
  getConductores,
  getRutaParada,
  getParadasBuffer
};
