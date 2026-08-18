import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Phase 1: local /public/media only. Add remote patterns here when a DAM/CDN is connected.
  },
};

export default withNextIntl(nextConfig);
