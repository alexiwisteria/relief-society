'use client';

import { useEffect, useState } from 'react';

// Define the Announcement type
interface Announcement {
    id: number;
    title: string;
    description: string;
    event_time: string;
}

export default function Home() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch announcements from the API
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/announcements/0'); // Correct endpoint for fetching all announcements
            if (!response.ok) {
                throw new Error('Failed to fetch announcements');
            }
            const data: Announcement[] = await response.json();
            setAnnouncements(data);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        // Fetch announcements on component mount
        fetchAnnouncements();

        // Listen for updates
        const handleUpdate = () => fetchAnnouncements();
        window.addEventListener('announcementsUpdated', handleUpdate);

        return () => {
            // Cleanup listener on unmount
            window.removeEventListener('announcementsUpdated', handleUpdate);
        };
    }, []);

    return (
        <div>
            <h1>Announcements</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {announcements.length > 0 ? (
                <ul>
                    {announcements.map((announcement) => (
                        <li key={announcement.id}>
                            <h2>{announcement.title}</h2>
                            <p>{announcement.description}</p>
                            <p>
                                Event Time:{' '}
                                {new Date(announcement.event_time).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No announcements found.</p>
            )}
        </div>
    );
}
