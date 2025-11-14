import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "app/railway/my-database.db");
const db = new Database(dbPath);

// Create users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    );
`).run();

// Create expenses table
db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        description TEXT,
        amount INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`).run();

// 🔥 Create trigger to auto-update updated_at
db.prepare(`
    CREATE TRIGGER IF NOT EXISTS trigger_update_expenses_timestamp
    AFTER UPDATE ON expenses
    FOR EACH ROW
    BEGIN
        UPDATE expenses
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
    END;
`).run();

export default db;
