// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'coverage/**',
      'node_modules/**',
    ],
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
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Permite usar any como tipo
      '@typescript-eslint/no-floating-promises': 'warn',// Permite usar promessas sem await
      '@typescript-eslint/no-unsafe-argument': 'warn',// Permite usar argumentos inseguros
      'prettier/prettier': 'off',// Desativa validação do prettier no ESLint

      '@typescript-eslint/interface-name-prefix': 'off',// Permite usar interface-name-prefix
      '@typescript-eslint/explicit-function-return-type': 'off',// Permite usar explicit-function-return-type
      '@typescript-eslint/explicit-module-boundary-types': 'off',// Permite usar explicit-module-boundary-types
      '@typescript-eslint/no-empty-function': 'off',// Permite usar no-empty-function
      '@typescript-eslint/no-unused-vars': 'off',// Permite usar no-unused-vars
      '@typescript-eslint/no-empty-interface': 'off',// Permite usar no-empty-interface
      '@typescript-eslint/no-namespace': 'off',// Permite usar no-namespace
    },
  },
);
