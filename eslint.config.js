import { createRequire } from "module";
const require = createRequire(import.meta.url);
const importPlugin = require("eslint-plugin-import");
const tsParser = require("@typescript-eslint/parser");

export default [
  {
    ignores: [
      "**/.next/**", "**/node_modules/**", "**/playwright-report/**",
      "**/coverage/**", "**/dist/**", "**/eslint.config.*",
      "**/postcss.config.js", "**/next.config.*", "**/tailwind.config.ts",
      "**/scripts/**", "**/components/ui/**", "**/lib/**",
      "**/hooks/**", "**/middleware.ts", "**/observability/**",
      "**/supabase/functions/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { import: importPlugin },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "import/order": ["error", { alphabetize: { order: "asc" } }],
    },
  },
];
