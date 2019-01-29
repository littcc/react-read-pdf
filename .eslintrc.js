module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb', 'prettier'],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
        jasmine: true,
    },
    rules: {
        // https://eslint.org/docs/rules/linebreak-style
        'linebreak-style': [0],

        // https://eslint.org/docs/rules/generator-star-spacing
        'generator-star-spacing': [0],

        // 函数必须要有明确的返回值
        // https://eslint.org/docs/rules/consistent-return
        'consistent-return': [0],

        // React propTypes 的类型不允许出现 any, array, object
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
        'react/forbid-prop-types': [0],

        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

        // https://eslint.org/docs/rules/global-require
        'global-require': [1],

        // 是否要求使用 === !==，因为项目原因暂时改为警告
        // https://eslint.org/docs/rules/eqeqeq
        eqeqeq: [1],

        // When there is only a single export from a module, prefer using default export over named export.
        // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/prefer-default-export.md
        'import/prefer-default-export': [0],

        // 组件中必须使用结构，暂时改为警告
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
        'react/destructuring-assignment': [1],

        // No .bind() or Arrow Functions in JSX Props
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
        'react/jsx-no-bind': [0],

        // TODO 强制要求配置 propTypes
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
        'react/prop-types': [0],

        // Stateless functional components are simpler than class based components and will benefit from future React performance optimizations specific to these components.
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
        'react/prefer-stateless-function': [0],

        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
        'react/jsx-wrap-multilines': [
            'error',
            {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'ignore',
            },
        ],

        // This option limits every line in JSX to one expression each.
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
        'react/jsx-one-expression-per-line': [0, { allow: 'single-child' }],

        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
        'react/no-multi-comp': [0],

        // jsx 缩进规则，启用并且设置缩进为4个空格
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
        'react/jsx-indent': [2, 4],

        // jsx props 缩进规则，启用并且设置缩进为4个空格
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
        'react/jsx-indent-props': [2, 4],

        // 存在 return 则不需要 esle
        // https://eslint.org/docs/rules/no-else-return
        'no-else-return': [0],

        // https://eslint.org/docs/rules/no-restricted-syntax
        'no-restricted-syntax': [0],

        // https://github.com/benmosher/eslint-plugin-import/blob/f7bd328f7b86c9f6d95c58c261b0b513df14bbd5/docs/rules/no-extraneous-dependencies.md
        'import/no-extraneous-dependencies': [0],

        // https://eslint.org/docs/rules/no-use-before-define
        'no-use-before-define': [0],

        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
        'jsx-a11y/no-static-element-interactions': [0],

        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
        'jsx-a11y/no-noninteractive-element-interactions': [0],

        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
        'jsx-a11y/click-events-have-key-events': [0],

        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
        'jsx-a11y/anchor-is-valid': [0],

        // https://eslint.org/docs/rules/no-nested-ternary
        'no-nested-ternary': [0],

        // https://eslint.org/docs/rules/arrow-body-style
        'arrow-body-style': [0],

        // https://github.com/benmosher/eslint-plugin-import/blob/f7bd328f7b86c9f6d95c58c261b0b513df14bbd5/docs/rules/extensions.md
        'import/extensions': [0],

        // https://eslint.org/docs/rules/no-bitwise
        'no-bitwise': [0],

        // https://eslint.org/docs/rules/no-cond-assign
        'no-cond-assign': [0],

        // https://github.com/benmosher/eslint-plugin-import/blob/f7bd328f7b86c9f6d95c58c261b0b513df14bbd5/docs/rules/no-unresolved.md
        'import/no-unresolved': [0],

        // https://eslint.org/docs/rules/camelcase
        camelcase: [0],

        // https://eslint.org/docs/rules/comma-dangle
        // https://prettier.io/docs/en/options.html#trailing-commas
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],

        // https://eslint.org/docs/rules/object-curly-newline
        'object-curly-newline': [0],

        // https://eslint.org/docs/rules/function-paren-newline
        'function-paren-newline': [0],

        // https://eslint.org/docs/rules/no-restricted-globals
        'no-restricted-globals': [0],

        // https://eslint.org/docs/rules/require-yield
        'require-yield': [1],

        // https://eslint.org/docs/rules/no-underscore-dangle
        'no-underscore-dangle': [0],

        // no-shadow 规则在组件中暂时无法避免，关闭该规则
        // https://eslint.org/docs/rules/no-shadow
        'no-shadow': [0],
        'react/button-has-type': [0],
        'no-class-assign': [0],
        'prefer-destructuring': [0],
        // http://eslint.cn/docs/rules/no-plusplus
        'no-plusplus': [0],
        // 禁止未使用过的表达式
        // http://eslint.cn/docs/rules/no-unused-expressions
        'no-unused-expressions': [0],
        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
        // https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/455
        'jsx-a11y/label-has-for': [0],
        'class-methods-use-this': [0],
        // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-cycle.md
        'import/no-cycle': [0],
        'no-param-reassign': [1],
    },

    // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
    },
    settings: {
        polyfills: ['fetch', 'promises'],
    },
};
