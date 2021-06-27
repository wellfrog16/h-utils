import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { eslint } from 'rollup-plugin-eslint' // eslint插件

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/bundle.cjs.js",
                format: "cjs",
            },
            {
                file: "lib/bundle.esm.js",
                format: "es",
            },
        ],
        plugins: [
            typescript({
                exclude: "node_modules/**",
                typescript: require("typescript"),
            }),
            eslint({
                throwOnError: true,
                include: ['src/**/*.ts'],
                exclude: ['node_modules/**', 'lib/**']
            })
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
