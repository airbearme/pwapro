import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";

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
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "import/order": "error",
    },
  },
];
