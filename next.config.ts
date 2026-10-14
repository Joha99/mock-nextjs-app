import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Only run the Tailwind loader on globals.css (the file that does
      // `@import "tailwindcss"`). A "*.css" glob combined with `as: "*.css"`
      // would also re-type every *.module.css file as plain global CSS,
      // which silently breaks CSS Modules (styles.foo === undefined).
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
