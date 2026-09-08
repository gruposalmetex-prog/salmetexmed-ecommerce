import type {
  NextConfig,
} from "next";

const cloudinaryCloudName =
  process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  images: {
    remotePatterns:
      cloudinaryCloudName
        ? [
            new URL(
              `https://res.cloudinary.com/${encodeURIComponent(
                cloudinaryCloudName,
              )}/image/upload/**`,
            ),
          ]
        : [],
  },
};

export default nextConfig;