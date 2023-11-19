/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['a0.muscache.com','res.cloudinary.com','freepik.com','homez.ibthemespro.com'],
    },
  }
  
  module.exports = nextConfig;
  