/** @type {import('next').NextConfig} */

// Where the Express API runs (server side only, never sent to the browser)
const API_URL = process.env.API_URL || "http://localhost:5000";

const nextConfig = {
  reactCompiler: true,

  // The browser calls /api/... on this same domain and Next forwards it to
  // the Express API. Same domain = the login cookie just works, no CORS issues.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
