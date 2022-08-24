import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const outDir = './dist'

const options = [
    {
        external: ['lodash-es', 'crypto-js/aes', 'crypto-js/enc-utf8'],
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
