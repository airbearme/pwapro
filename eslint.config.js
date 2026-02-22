import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pluginImport = require("eslint-plugin-import");
const tsparser = require("@typescript-eslint/parser");

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
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "import/order": "error",
    },
  },
];
