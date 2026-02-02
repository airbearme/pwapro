import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

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
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    rules: {
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
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },
];
