// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',

      '@typescript-eslint/explicit-function-return-type': ['warn'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-unsafe-return': ['warn'],
      '@typescript-eslint/no-unsafe-member-access': ['warn'],


      // Force toutes les erreurs Prettier en `warn`
    'prettier/prettier': ['warn', {
      "singleQuote": true,
      "trailingComma": "all",
      "tabWidth": 4,
      "semi": true,
      "bracketSpacing": true,
      "bracketSameLine": false,
      "arrowParens": "always",
      "endOfLine": "auto",
      "printWidth": 120
    }],
    },
  },
);