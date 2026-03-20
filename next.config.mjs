const nextConfig = {
  images: {
    domains: ["example.com", "res.cloudinary.com", "res.cloudinary.com", "avatar.iran.liara.run"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
