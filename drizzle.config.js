import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    schema: "./migrations/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    ssl: false,
    verbose: true,
    schemaFilter: ["public", "file_storage", "production_flow", "sales", "user_management"],
});
