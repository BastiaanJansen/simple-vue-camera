import vue from "rollup-plugin-vue";
import ts from "rollup-plugin-typescript2";
import css from "rollup-plugin-import-css";
import pkg from "./package.json";

function createEntry(options) {
    const config = {
        input: "./src/index.ts",
        external: ["vue"],
        output: {
            file: options.file,
            format: options.format,
            name: "SimpleVueCamera",
            globals: {
                vue: "vue",
            },
        },
        plugins: [
            ts({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: true,
                    },
                },
            }),
            vue(),
            css(),
        ],
    };

    return config;
}

export default [
    createEntry({
        format: "iife",
        file: pkg.browser,
    }),
    createEntry({
        format: "es",
        file: pkg.module,
    }),
    createEntry({
        format: "cjs",
        file: pkg.main,
    }),
];
