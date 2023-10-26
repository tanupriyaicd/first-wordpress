/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // swcMinify:true,
  // async rewrites
  rewrites: async () => [
    {
      source: "/public/mFile.html",
      destination: "/pages/api/myFile2.js",
    },
  ],
}

module.exports = nextConfig
