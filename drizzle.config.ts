import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import pgConnectionString from "pg-connection-string";

const config = pgConnectionString.parse(process.env.DATABASE_URL!);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: config.host!,
    port: config.port ? Number(config.port) : 5432,
    user: config.user!,
    password: config.password!,
    database: config.database!,
    ssl: "require",
  },
});
