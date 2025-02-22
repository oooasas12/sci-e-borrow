import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  /* config options here */
  title: "ระบบครุภัณฑ์ | คณะวิทยาศาตร์และเทคโนโลยี",
  reactStrictMode: true,
  ssr: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
