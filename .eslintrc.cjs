module.exports = {
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier', // Ensure this is correctly listed
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    plugins: [
        'import',
        'prettier',
    ],
    rules: {
        'prettier/prettier': 'error',
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        }],
        'import/no-unresolved': 'error',
        'no-console': 'warn',
        'no-unused-vars': 'warn',
        'no-undef': 'error',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    }
};
