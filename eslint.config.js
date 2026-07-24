import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import htmlPlugin from 'eslint-plugin-html'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  { ignores: ['vite.config.ts', 'dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...tsPlugin.configs['flat/recommended-type-checked'],

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      html: htmlPlugin
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      react: { version: 'detect' }
    },
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unused-vars': [1, { ignoreRestSiblings: true }],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': [
        'warn',
        { ignoreDeclarationMerge: true }
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-undef': 'off',
      'no-shadow': 'off',
      'no-debugger': 1,
      'no-use-before-define': 'off',
      'no-alert': 0,
      'no-await-in-loop': 0,
      'no-return-assign': ['error', 'except-parens'],
      'no-restricted-syntax': [
        2,
        'ForInStatement',
        'LabeledStatement',
        'WithStatement'
      ],
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-unused-expressions': [
        'error',
        {
          allowTaggedTemplates: true,
          allowShortCircuit: true,
          allowTernary: true
        }
      ],
      'no-param-reassign': [2, { props: false }],
      'no-console': 0,
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
      'import/extensions': 0,
      'func-names': 0,
      'space-before-function-paren': 0,
      'comma-dangle': 0,
      'max-len': 0,
      'no-underscore-dangle': 0,
      'consistent-return': 0,
      'react/display-name': 0,
      'react/no-array-index-key': 0,
      'react/react-in-jsx-scope': 0,
      'react/prefer-stateless-function': 0,
      'react/forbid-prop-types': 0,
      'react/no-unescaped-entities': 0,
      'react/function-component-definition': 0,
      'jsx-a11y/accessible-emoji': 0,
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'react/require-default-props': 0,
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'] }
      ],
      radix: 0,
      'jsx-a11y/href-no-hash': 'off',
      'jsx-a11y/anchor-is-valid': ['warn', { aspects: ['invalidHref'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-props-no-spreading': 'off'
    }
  },

  prettierRecommended
]
