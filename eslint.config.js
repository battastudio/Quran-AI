import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'scripts', 'public'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2020 },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
