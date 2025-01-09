'use client';

import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import Button from "../UI/button";

const Footer = () => {
    const router = useRouter();

    return (
        <footer>
            <div>
                <Button
                    label="Admin Login"
                    onClick={() => router.push("/admin-login")} // Navigate using next/navigation
                />
                <Button
                    label="Announcements"
                    onClick={() => router.push("/")}
                />
            </div>
        </footer>
    );
};

export default Footer;
