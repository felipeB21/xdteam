/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "trackercdn.com",
      },
      {
        protocol: "https",
        hostname: "ubisoft-avatars.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
      },
    ],
  },
};

export default nextConfig;
