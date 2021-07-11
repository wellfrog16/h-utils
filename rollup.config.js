// import { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import babel from 'rollup-plugin-babel';
// import { eslint } from 'rollup-plugin-eslint' // eslint插件，有bug

// const production = !process.env.ROLLUP_WATCH;

const options = [
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/cjs.js",
                format: "cjs",
            },
            {
                file: "lib/index.js",
                format: "es",
                // sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                exclude: "node_modules/**",
                typescript: require("typescript"),
            }),
            // eslint有bug
            // eslint({
            //     throwOnError: true,
            //     include: ['src/**/*.ts'],
            //     exclude: ['node_modules/**', 'lib/**']
            // })
        ],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/es5.js",
                format: "es",
                // sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                exclude: "node_modules/**",
                typescript: require("typescript"),
            }),
            babel({
                extensions: ['.js', '.ts'],
                exclude: /node_modules/,
                babelrc: false,
                runtimeHelpers: true,
                presets: [
                    '@babel/preset-env',
                ],
                // plugins: [
                //     'react-require',
                //     '@babel/plugin-syntax-dynamic-import',
                //     '@babel/plugin-proposal-class-properties',
                //     ['@babel/plugin-proposal-object-rest-spread', {
                //         useBuiltIns: true,
                //     }],
                //     ['@babel/plugin-transform-runtime', {
                //         corejs: 2,
                //         helpers: true,
                //         regenerator: true,
                //         useESModules: false,
                //     }],
                // ],
            }),
        ],
    },
    {
        input: "src/index.ts",
        output: {
            file: "lib/index.d.ts",
            format: 'es',
        },
        plugins: [dts()],
    }
]

export default options;
