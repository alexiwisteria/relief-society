import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database
const dbPath = path.resolve(__dirname, '../../../db/database.sqlite');
const db = new Database(dbPath);

// Ensure the `announcements` table exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_time DATETIME NOT NULL
    )
`).run();

// Handle POST requests
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, event_time } = body;

        if (!title || !description || !event_time) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description, or event_time' },
                { status: 400 }
            );
        }

        if (isNaN(Date.parse(event_time))) {
            return NextResponse.json(
                { error: 'Invalid event_time format. Provide a valid date string.' },
                { status: 400 }
            );
        }

        db.prepare(
            'INSERT INTO announcements (title, description, event_time) VALUES (?, ?, ?)'
        ).run(title.trim(), description.trim(), event_time);

        return NextResponse.json(
            { message: 'Announcement created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json(
            { error: 'Failed to create announcement' },
            { status: 500 }
        );
    }
}

// Handle GET requests
export async function GET() {
    try {
        const announcements = db.prepare('SELECT * FROM announcements ORDER BY event_time DESC').all();
        return NextResponse.json(announcements, { status: 200 });
    } catch (error) {
        console.error('Error in GET:', error);
        return NextResponse.json(
            { error: 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}

// Handle DELETE requests
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = parseInt(url.pathname.split('/').pop() || '', 10);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'A valid numeric ID is required to delete an announcement.' },
                { status: 400 }
            );
        }

        console.log(`Attempting to delete announcement with ID: ${id}`);

        // Simulated database operation
        const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);

        if (result.changes === 0) {
            console.warn(`Announcement with ID ${id} not found.`);
            return NextResponse.json(
                { error: `Announcement with ID ${id} not found.` },
                { status: 404 }
            );
        }

        console.log(`Successfully deleted announcement with ID: ${id}`);
        return NextResponse.json(
            { message: `Announcement with ID ${id} deleted successfully.` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE:', error);
        return NextResponse.json(
            { error: 'Failed to delete the announcement.' },
            { status: 500 }
        );
    }
}

