import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as relations from "./relations";
import * as tables from "./schema";
import * as authSchema from "./auth-schema"

const drizzleSchema = {
  ...tables,
  ...relations,
  ...authSchema,
};

let client: ReturnType<typeof postgres> | undefined;

export function getDatabaseClient() {
  if (client) {
    return client;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL no está configurada");
  }

  client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

  return client;
}

function createDatabase() {
  return drizzle(getDatabaseClient(), {
    schema: drizzleSchema,
  });
}

export type Database = ReturnType<typeof createDatabase>;

let database: Database | undefined;

export function getDatabase(): Database {
  if (database) {
    return database;
  }

  database = createDatabase();

  return database;
}
