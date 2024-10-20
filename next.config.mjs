/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/song",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  env: {
    PROJECT_ID: process.env.PROJECT_ID,
    DATABASE_ID: process.env.DATABASE_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    ACTIVITY_ID: process.env.ACTIVITY_ID,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    GALLERY_ID: process.env.GALLERY_ID,
    STARRED_ID: process.env.STARRED_ID,
    USERS_ID: process.env.USERS_ID,
    SITE_KEY: process.env.SITE_KEY,
    UPLOAD_AUTH: process.env.UPLOAD_AUTH,
    GEMINI_API: process.env.GEMINI_API,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URL: process.env.MONGODB_URL,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "the-chiefly-lasagna.tixte.co",
      },
      {
        protocol: "https",
        hostname: "tanmay111-files.tixte.co",
      },
      {
        protocol: "https",
        hostname: "https://us-east-1.tixte.ne",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "c.saavncdn.com",
      },
    ],
  },
};

export default nextConfig;
