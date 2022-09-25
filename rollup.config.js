import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const outDir = './dist'

const options = [
    {
        external: ['lodash-es', 'crypto-js/aes.js', 'crypto-js/enc-utf8.js'],
        input: 'src/index.ts',
        output: [
            {
                file: `${outDir}/index.mjs`,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                name: 'hutils',
                file: `${outDir}/umd.js`,
                format: 'umd',
                sourcemap: true,
                esModule: false,
            },
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
            }),
            nodeResolve(),
            commonjs(),
            terser(),
        ],
    },
]

export default options
