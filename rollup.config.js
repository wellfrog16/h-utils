// import { RollupOptions } from "rollup";
import typescript from '@rollup/plugin-typescript'
// import dts from 'rollup-plugin-dts'
// import babel from 'rollup-plugin-babel'
// import { eslint } from 'rollup-plugin-eslint' // eslint插件，有bug

// const production = !process.env.ROLLUP_WATCH;

// const { compilerOptions: tsOptions } = tsconfig

const outDir = './dist'

const options = [
    {
        input: 'src/index.ts',
        output: [
            {
                file: `${outDir}/index.js`,
                format: 'es',
                sourcemap: true,
            },
            {
                file: `${outDir}/cjs.js`,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: `${outDir}/amd.js`,
                format: 'amd',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
            }),
        ],
    },
    // {
    //     input: 'src/index.ts',
    //     output: [
    //         {
    //             file: 'lib/es5.js',
    //             format: 'es',
    //             // sourcemap: true,
    //         },
    //     ],
    //     plugins: [
    //         typescript({
    //             exclude: 'node_modules/**',
    //             typescript: require('typescript'),
    //         }),
    //         babel({
    //             extensions: ['.js', '.ts'],
    //             exclude: /node_modules/,
    //             babelrc: false,
    //             runtimeHelpers: true,
    //             presets: [
    //                 '@babel/preset-env',
    //             ],
    //         }),
    //     ],
    // },
    // {
    //     input: 'src/index.ts',
    //     output: {
    //         file: 'lib/index.d.ts',
    //         format: 'es',
    //     },
    //     plugins: [dts()],
    // },
]

export default options
