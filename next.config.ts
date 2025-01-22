import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/weather",
        destination: "/weather/il/jerusalem",
        permanent: true,
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
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.jfeed.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap",
        },
        {
          source: "/sitemap.xml/:path*",
          destination: "/api/sitemap/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
