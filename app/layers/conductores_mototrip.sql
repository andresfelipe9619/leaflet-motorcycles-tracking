SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "conductores_mototrip" (gid serial,
"id" int4,
"barrio" varchar(50),
"modelo_mot" varchar(10),
"marca_moto" varchar(10),
"color" varchar(10),
"conductor" varchar(50));
ALTER TABLE "conductores_mototrip" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','conductores_mototrip','geom','4326','POINT',2);
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('1','melendez','cbf 150','honda cbf','azul','William Ruales','0101000020E61000001C9B940EEE293041A1BEB138BD662A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('2','napoles','125','yamaha','verde','Edmundo Rengifo','0101000020E6100000AE47E1BA1629304109F9A027096F2A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('3','buenos aires','110','kawasaki','blanca','Jesus Aguirre','0101000020E61000009121B7EEC6283041DC06A3B818762A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','plaza de toros','r125','bajaj','plateada','Fernando Oquendo','0101000020E6100000720B897037283041DE8D0721FA822A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','El Lido','mini110','royal','negra','Oscar Endo','0101000020E61000009284B58AC3273041522D710383872A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('5','San Fernando','110','akt','negra','Jalber Ortiz','0101000020E6100000F52E8797C02A304192AAEF398F982A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('6','centenario','115','kymco','roja','Robert Rojas','0101000020E6100000789CA2F3702B3041DD24068195A72A41');
INSERT INTO "conductores_mototrip" ("id","barrio","modelo_mot","marca_moto","color","conductor",geom) VALUES ('7','Terron Colorado','200','ktm','azul','Oscar Marin','0101000020E6100000B89C827155273041A624484BA5A92A41');
CREATE INDEX ON "conductores_mototrip" USING GIST ("geom");
COMMIT;
ANALYZE "conductores_mototrip";
