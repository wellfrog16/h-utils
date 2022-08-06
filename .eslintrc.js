module.exports = {
    extends: [
        '@antfu/eslint-config-ts',
    ],
    globals: {
        IGlobal: 'readonly',
    },
    overrides: [
        {
            files: ['*.ts', '*.js'],
            rules: {
                'indent': ['error', 4, { SwitchCase: 1 }],
                '@typescript-eslint/indent': ['error', 4],
                'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
                'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
                'arrow-parens': ['error', 'as-needed'],
                'curly': ['error', 'all'],
                'no-extra-semi': 'error',
                'import/order': ['error', {
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'external',
                            position: 'after',
                        },
                    ],
                    groups: ['internal', 'external', 'index', 'sibling', 'parent', 'builtin', 'object', 'type'],
                },
                ],
            },
        },
    ],
}
