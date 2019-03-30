SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "paradas_mototrip" (gid serial,
"id" int4,
"nombre" varchar(50),
"barrio" varchar(50));
ALTER TABLE "paradas_mototrip" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','paradas_mototrip','geom','4326','POINT',2);
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('1','Melendez','melendez','0101000020E61000001C9B940EEE293041A1BEB138BD662A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('2','psiquiatrico','napoles','0101000020E6100000AE47E1BA1629304109F9A027096F2A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('3','Premier limonar','buenos aires','0101000020E61000009121B7EEC6283041DC06A3B818762A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('5','Plaza de Toros','plaza de toros','0101000020E6100000720B897037283041DE8D0721FA822A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('5','Cosmocentro','El Lido','0101000020E61000009284B58AC3273041522D710383872A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('5','Manzana del Saber','San Fernando','0101000020E6100000F52E8797C02A304192AAEF398F982A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('6','Tres Cruces','centenario','0101000020E6100000789CA2F3702B3041DD24068195A72A41');
INSERT INTO "paradas_mototrip" ("id","nombre","barrio",geom) VALUES ('7','La Portada','Terron Colorado','0101000020E6100000B89C827155273041A624484BA5A92A41');
CREATE INDEX ON "paradas_mototrip" USING GIST ("geom");
COMMIT;
ANALYZE "paradas_mototrip";
