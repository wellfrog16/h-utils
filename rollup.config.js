// import { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
// import { eslint } from 'rollup-plugin-eslint' // eslint插件，有bug

// const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/index.cjs.js",
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
        output: {
            file: "lib/index.d.ts",
            format: 'es',
        },
        plugins: [dts()],
    }
]
