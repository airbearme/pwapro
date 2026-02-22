import tsParser from "@typescript-eslint/parser";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let importPlugin;
try {
  importPlugin = require("eslint-plugin-import");
} catch (e) {
  // Ignored if not found
}

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/playwright-report/**",
      "**/coverage/**",
      "**/dist/**",
      "**/eslint.config.*",
      "**/postcss.config.js",
      "**/next.config.*",
      "**/tailwind.config.ts",
      "**/scripts/**",
      "**/components/ui/**",
      "**/lib/**",
      "**/hooks/**",
      "**/middleware.ts",
      "**/observability/**",
      "**/supabase/functions/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      ...(importPlugin ? { import: importPlugin } : {}),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      ...(importPlugin
        ? {
            "import/order": [
              "error",
              {
                groups: [
                  "builtin",
                  "external",
                  "internal",
                  "parent",
                  "sibling",
                  "index",
                ],
                "newlines-between": "always",
                alphabetize: { order: "asc", caseInsensitive: true },
              },
            ],
          }
        : {}),
    },
  },
];
