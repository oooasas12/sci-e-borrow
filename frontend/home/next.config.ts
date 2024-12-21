import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
