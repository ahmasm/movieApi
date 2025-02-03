import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      globals: {
        process: "readonly", // ✅ Fixes 'process is not defined'
        console: "readonly", // ✅ Fixes 'console is not defined'
        module: "readonly" // ✅ Fixes 'module is not defined'
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "prettier": prettierPlugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "no-console": "warn", // ✅ Allows console but warns instead of error
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "error",
      "no-undef": "off" // ✅ Disables undefined variable errors
    }
  },
  {
    files: ["migrate-mongo-config.js", "migrations/*.js"],
    languageOptions: {
      globals: {
        module: "readonly" // ✅ Allows module.exports in migration files
      }
    }
  },
  prettierConfig
];
