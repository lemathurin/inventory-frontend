/** @type {import('next').NextConfig} */
const withMDX = require("@next/mdx")();

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },
  // Add MDX to pageExtensions
  pageExtensions: ["ts", "tsx", "mdx"],
};

module.exports = withMDX(nextConfig);
