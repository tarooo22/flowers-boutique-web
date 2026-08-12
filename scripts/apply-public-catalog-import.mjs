import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const sqlFile = process.env.CATALOG_IMPORT_SQL ?? "/home/ubuntu/catalog-work/import-public-catalog.sql";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to apply the public catalog import.");
}

const catalogSql = await readFile(sqlFile, "utf8");
if (!catalogSql.includes("START TRANSACTION;") || !catalogSql.includes("COMMIT;")) {
  throw new Error("Refusing to run an import file without explicit transaction boundaries.");
}
const sqlWithoutLineComments = catalogSql.replace(/^--.*$/gm, "");
if (/\b(DELETE|DROP|TRUNCATE|ALTER)\b/i.test(sqlWithoutLineComments)) {
  throw new Error("Refusing to run a catalog import that contains destructive DDL/DML keywords.");
}

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
  multipleStatements: true,
});

try {
  const [beforeRows] = await connection.query(
    "SELECT COUNT(*) AS products FROM products; SELECT COUNT(*) AS categories FROM categories;"
  );
  await connection.query(catalogSql);
  const [afterRows] = await connection.query(
    "SELECT COUNT(*) AS products FROM products; SELECT COUNT(*) AS categories FROM categories; SELECT COUNT(*) AS persistentImages FROM products WHERE published = 1 AND imageUrl LIKE '/manus-storage/%'; SELECT COUNT(*) AS imageUnavailable FROM products WHERE published = 1 AND imageUrl IS NULL; SELECT COUNT(*) AS legacySamplesStillPublic FROM products WHERE id IN (1, 2, 3, 4, 5) AND published = 1;"
  );
  console.log(
    JSON.stringify(
      {
        importFile: sqlFile,
        before: beforeRows,
        after: afterRows,
      },
      null,
      2
    )
  );
} finally {
  await connection.end();
}
