SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "conductores_mototrip_wgs84" (gid serial,
"id" int8,
"barrio" varchar(50),
"modelo_mot" varchar(10),
"marca_moto" varchar(10),
"color" varchar(10),
"conductor" varchar(50));
ALTER TABLE "conductores_mototrip_wgs84" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','conductores_mototrip_wgs84','geom','4326','POINT',2);
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('1','melendez','cbf 150','honda cbf','azul','William Ruales','0101000020E6100000BAB074B5CE2253C0BEA3A7A3CB020B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('2','napoles','125','yamaha','verde','Edmundo Rengifo','0101000020E6100000943F5774EE2253C0798CBDF375160B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('3','buenos aires','110','kawasaki','blanca','Jesus Aguirre','0101000020E610000054319F38FA2253C017D13A6632270B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','plaza de toros','r125','bajaj','plateada','Fernando Oquendo','0101000020E6100000C44F80610F2353C0F2FEC231BA450B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','El Lido','mini110','royal','negra','Oscar Endo','0101000020E6100000ACE5F377202353C0B4D5C4CF79500B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','San Fernando','110','akt','negra','Jalber Ortiz','0101000020E6100000C063CAB1AF2253C0CA9D9F5BE2780B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('6','centenario','115','kymco','roja','Robert Rojas','0101000020E6100000D86792B3952253C0ED3DC92B7F9C0B40');
INSERT INTO "conductores_mototrip_wgs84" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('7','Terron Colorado','200','ktm','azul','Oscar Marin','0101000020E61000004234F9B7302353C0B61AFB0E62A10B40');
CREATE INDEX ON "conductores_mototrip_wgs84" USING GIST ("geom");
COMMIT;
ANALYZE "conductores_mototrip_wgs84";
