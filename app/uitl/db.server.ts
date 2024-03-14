import { drizzle } from "drizzle-orm/d1";

export const createDBClient = (database: D1Database) => drizzle(database, { logger: true });
