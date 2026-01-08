import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/playwright-report/**",
      "**/coverage/**",
      "**/dist/**",
      "**/eslint.config.mjs",
      "**/postcss.config.js",
      "**/next.config.*",
      "**/tailwind.config.ts",
    ],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  ...compat.extends("next/core-web-vitals", "next"),
];
