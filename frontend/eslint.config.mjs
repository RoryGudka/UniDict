import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import noRelativeImportPaths from "@eslint/no-relative-import-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: ["no-relative-import-paths"],
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: false, rootDir: "frontend" },
      ],
      "import/no-duplicates": "error",
      "no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
