SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "paradas_mototrip_wgs" (gid serial,
"id" int8,
"nombre" varchar(50),
"barrio" varchar(50));
ALTER TABLE "paradas_mototrip_wgs" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','paradas_mototrip_wgs','geom','4326','POINT',2);
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('1','Melendez','melendez','0101000020E6100000BAB074B5CE2253C0BEA3A7A3CB020B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('2','psiquiatrico','napoles','0101000020E6100000943F5774EE2253C0798CBDF375160B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('3','Premier limonar','buenos aires','0101000020E610000054319F38FA2253C017D13A6632270B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('5','Plaza de Toros','plaza de toros','0101000020E6100000C44F80610F2353C0F2FEC231BA450B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('5','Cosmocentro','El Lido','0101000020E6100000ACE5F377202353C0B4D5C4CF79500B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('5','Manzana del Saber','San Fernando','0101000020E6100000C063CAB1AF2253C0CA9D9F5BE2780B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('6','Tres Cruces','centenario','0101000020E6100000D86792B3952253C0ED3DC92B7F9C0B40');
INSERT INTO "paradas_mototrip_wgs" ("id","nombre","barrio",geom) VALUES ('7','La Portada','Terron Colorado','0101000020E61000004234F9B7302353C0B61AFB0E62A10B40');
CREATE INDEX ON "paradas_mototrip_wgs" USING GIST ("geom");
COMMIT;
ANALYZE "paradas_mototrip_wgs";
