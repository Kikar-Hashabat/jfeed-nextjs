import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/weather",
        destination: "/weather/il/jerusalem",
        permanent: true, // 301
      },
      {
        source: "/shabbat-times",
        destination: `/shabbat-times/il/jerusalem/${
          new Date().toISOString().split("T")[0]
        }`,
        permanent: true,
      },
      {
        source: "/halachic-times",
        destination: `/halachic-times/il/jerusalem/${
          new Date().toISOString().split("T")[0]
        }`,
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.jfeed.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jfeed.com",
        pathname: "/assets/images/**",
      },
      {
        protocol: "https",
        hostname: "assets.jfeed.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
