/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgafttcsbadhacbzrrmt.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "falasteenifoodie.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com", // ✅ Add this
      },
    ],
  },
};

module.exports = nextConfig;