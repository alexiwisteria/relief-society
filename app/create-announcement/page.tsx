'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Announcement {
    id: number;
    title: string;
    description: string;
    event_time: string;
}

const CreateAnnouncement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventTime, setEventTime] = useState<Date | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            alert('Session expired. Redirecting to login.');
            router.push('/admin-login');
        }
    }, [status, router]);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/announcements/0'); // Fetch all announcements
            if (!response.ok) {
                throw new Error(`Error fetching announcements: ${response.status}`);
            }
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            alert('Failed to fetch announcements.');
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim() || !eventTime) {
            alert('Please fill out all fields.');
            return;
        }

        if (title.length > 100) {
            alert('Title cannot exceed 100 characters.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/announcements/0', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    event_time: eventTime.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Error creating announcement: ${response.status}`);
            }

            alert('Announcement created successfully!');
            setTitle('');
            setDescription('');
            setEventTime(null);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`Error deleting announcement: ${response.status}`);
            }

            alert('Announcement deleted successfully!');
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
        } catch (error) {
            console.error(`Error deleting announcement with ID ${id}:`, error);
            alert('Failed to delete the announcement.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Create Announcement</h1>
            <button onClick={() => signOut()}>Sign Out</button>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    rows={3}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <DatePicker
                    selected={eventTime}
                    onChange={(date: Date | null) => setEventTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="Select Date and Time"
                />
                <button onClick={handleSubmit} disabled={loading}>Submit</button>
            </div>
            <div>
                <h2>All Announcements</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : announcements.length === 0 ? (
                    <p>No announcements available.</p>
                ) : (
                    <ul>
                        {announcements.map((announcement) => (
                            <li key={announcement.id}>
                                <div>
                                    <h3>{announcement.title}</h3>
                                    <p>{announcement.description}</p>
                                    <p>{new Date(announcement.event_time).toLocaleString()}</p>
                                </div>
                                <button onClick={() => handleDelete(announcement.id)} disabled={loading}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CreateAnnouncement;
