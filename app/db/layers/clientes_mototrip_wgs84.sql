SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "clientes_mototrip_wgs84" (gid serial,
"id" int8,
"nombre" varchar(50),
"cedula" varchar(20),
"id_cliente" int8,
"telefono" varchar(10));
ALTER TABLE "clientes_mototrip_wgs84" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','clientes_mototrip_wgs84','geom','4326','POINT',2);
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('1','Gabriela Chamorro','114872583','1','301587546','0101000020E610000015AD1C0F532353C00444DA9F69AC0B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('0','Katherine Montes','15487894','2','3201237895','0101000020E6100000AC9D1F52E12253C0D25AF59F2FA50B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('2','Lina Cardenas','15486258','2','3158576312','0101000020E6100000B6137395AE2353C03CBD542A037C0B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('3','Luzaide Nunez','12543587','3','315125874','0101000020E6100000857E4904AB2353C0B89E6EBB53620B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('4','Diana Ortiz','158791225','4','313516584','0101000020E6100000BFEBA1D0522453C02A448F5AD6440B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('5','Carolina Cardona','35287851','5','1318748745','0101000020E6100000C4164013CE2353C0500EF05C1A260B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('6','Milena Barreto','25468413','6','132584583','0101000020E61000003BC87156B02353C0889224136A0B0B40');
INSERT INTO "clientes_mototrip_wgs84" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('7','Paola Rivas','02484120','7','3215416841','0101000020E610000027CEDF1FB62353C03041575E6BFE0A40');
CREATE INDEX ON "clientes_mototrip_wgs84" USING GIST ("geom");
COMMIT;
ANALYZE "clientes_mototrip_wgs84";
