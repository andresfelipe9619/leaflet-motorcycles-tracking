const selectQuery = (entity, props) =>
  ` SELECT ST_AsGeoJSON(geom), nombre 
    FROM ${entity};
   `;

const getParadas = selectQuery("paradas_mototrip_wgs");

const getConductores = selectQuery("conductores_mototrip_wgs84");

module.exports = {
  getParadas,
  getConductores
};
