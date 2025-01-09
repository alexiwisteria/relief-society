'use client';

import { SessionProvider } from 'next-auth/react';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import * as React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProvider>
            <div>
                {/* Fixed Header */}
                <Header />

                {/* Main Content */}
                <main>
                    {children}
                </main>

                {/* Fixed Footer */}
                <Footer />
            </div>
        </SessionProvider>
        </body>
        </html>
    );
}
