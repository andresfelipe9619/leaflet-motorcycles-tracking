SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;
BEGIN;
CREATE TABLE "clientes_mototrip" (gid serial,
"id" int4,
"nombre" varchar(50),
"cedula" varchar(20),
"id_cliente" int4,
"telefono" varchar(10));
ALTER TABLE "clientes_mototrip" ADD PRIMARY KEY (gid);
SELECT AddGeometryColumn('','clientes_mototrip','geom','4326','POINT',2);
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('1','Gabriela Chamorro','114872583','1','301587546','0101000020E610000082866D866C26304117807A8A4CAE2A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('0','Katherine Montes','15487894','2','3201237895','0101000020E6100000F713520570293041BAE03A0040AB2A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('2','Lina Cardenas','15486258','2','3158576312','0101000020E61000009D8D8598FF2330416590222FE1992A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('3','Luzaide Nunez','12543587','3','315125874','0101000020E6100000FCAF2FBD172430415195E9130B8F2A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('4','Diana Ortiz','158791225','4','313516584','0101000020E610000008AC1C6AA51F304176711B2D9A822A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('5','Carolina Cardona','35287851','5','1318748745','0101000020E6100000BE3099CA29233041EA95B2ACA2752A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('6','Milena Barreto','25468413','6','132584583','0101000020E6100000ECA4F576F3233041CD548F30606A2A41');
INSERT INTO "clientes_mototrip" ("id","nombre","cedula","id_cliente","telefono",geom) VALUES ('7','Paola Rivas','02484120','7','3215416841','0101000020E6100000FC3A702ECC233041B37BF2B0E4642A41');
CREATE INDEX ON "clientes_mototrip" USING GIST ("geom");
COMMIT;
ANALYZE "clientes_mototrip";
