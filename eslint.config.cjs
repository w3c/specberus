[
    {
        extends: ['airbnb-base', 'prettier'],
        plugins: ['prettier'],
        rules: {
            'prettier/prettier': 'error',
            'no-shadow': 'off',
            'consistent-return': 'warn',
            'no-param-reassign': 'off',
            strict: 'off',
            'global-require': 'off',
            'no-restricted-syntax': 'warn',
            'guard-for-in': 'warn',
            'prefer-destructuring': 'warn',
            'import/prefer-default-export': 'off',
            'import/extensions': 'off',
        },
        ignores: ['doc/api'],
        overrides: [
            {
                files: ['public/js/*.js'],
                env: {
                    browser: true,
                    jquery: true,
                    es6: true,
                },
                rules: {},
            },
            {
                files: ['app.js', 'lib/**/*.js', 'tools/**/*.js'],
                plugins: ['node'],
                parserOptions: {
                    ecmaVersion: 2020,
                    sourceType: 'module',
                },
                extends: ['plugin:node/recommended'],
            },
            {
                files: ['test/**/*.js'],
                env: {
                    mocha: true,
                },
                rules: {
                    'node/no-unpublished-require': 'off',
                },
                plugins: ['node'],
                extends: 'plugin:node/recommended',
                parserOptions: {
                    ecmaVersion: 2022,
                    sourceType: 'module',
                },
            },
        ],
    },
];
