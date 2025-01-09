/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Disable ESLint checks during builds
    },
    reactStrictMode: true, // Optional, but good practice
};

module.exports = nextConfig;
