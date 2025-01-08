import createConfig from "@aicv-app/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import tailwindPlugin from "eslint-plugin-tailwindcss";

export default createConfig({
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
    "tailwindcss": tailwindPlugin,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "tailwindcss/classnames-order": "error",
    "tailwindcss/no-contradicting-classname": "error",
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: [
        "README.md",
        /^~.*\.tsx?$/,
      ],
    }],
  },
  settings: {
    tailwindcss: {
      config: "apps/web/tailwind.config.ts",
    },
  },
});
