import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database.db");
const db = new Database(dbPath);

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    `
).run();

export default db;