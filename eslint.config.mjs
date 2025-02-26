import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable the quotes/apostrophes escaped entity rule
      "react/no-unescaped-entities": "off",
      
      // Disable unused variables warning
      "@typescript-eslint/no-unused-vars": "warn" // Change to "off" if you want to completely disable it
    }
  }
];

export default eslintConfig;