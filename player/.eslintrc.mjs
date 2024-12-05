import { sharedConfig } from "../eslint.shared.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  ...sharedConfig,
  {
    languageOptions: {
      parserOptions: {
        project: [
          `${__dirname}/tsconfig.json`,
          `${__dirname}/tsconfig.app.json`,
          `${__dirname}/tsconfig.node.json`,
        ],
        tsconfigRootDir: __dirname,
      },
    },
  },
];
