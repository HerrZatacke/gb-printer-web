import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import eslintTypescript from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...eslintTypescript,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './packages/*/tsconfig.json',
        },
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-bitwise': ['error'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          }
        }
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          'newlines-between': 'never',
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],
      // 'import/no-duplicates': 'error',
      "no-restricted-globals": [
        "error",
        { "name": "Date", "message": "Use `import { Date } from '@/tools/safeDate';` instead of using the global." }
      ],
      '@typescript-eslint/no-deprecated': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'packages/gb-printer-web/.next/**',
    'packages/gb-printer-web/out/**',
    'packages/gb-printer-web/o/**',
    'dist/**',
    'build/**',
    'packages/gb-printer-web/next-env.d.ts',
  ]),
])

export default eslintConfig
