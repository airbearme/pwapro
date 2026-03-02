import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

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
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
        React: "writable",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];
