/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",              // frontend calls → /api/ask
        destination: "http://localhost:4000/api/:path*", // goes to backend
      },
    ];
  },
};

export default nextConfig;
