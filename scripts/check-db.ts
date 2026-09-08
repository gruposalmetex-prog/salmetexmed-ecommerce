import { config } from "dotenv";
import { getDatabaseClient } from "../src/db";

config({ path: ".env.local" });

async function checkDatabase() {
  const sql = getDatabaseClient();

  try {
    const [result] = await sql<{
      database: string;
      version: string;
    }[]>`
      SELECT
        current_database() AS database,
        version() AS version
    `;

    console.log("Conexión correcta");
    console.log(`Base de datos: ${result.database}`);
    console.log(`PostgreSQL: ${result.version}`);
  } finally {
    await sql.end();
  }
}

checkDatabase().catch((error) => {
  console.error("No se pudo conectar con Neon");
  console.error(error);
  process.exit(1);
});