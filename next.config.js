/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true, // Good practice to enable strict mode
};

module.exports = nextConfig;
