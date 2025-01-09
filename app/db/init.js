import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create the `announcements` table with the new schema
db.prepare(`
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_time DATETIME NOT NULL
    )
`).run();

console.log('Database initialized at:', dbPath);
