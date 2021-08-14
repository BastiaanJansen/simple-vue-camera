import vue from "rollup-plugin-vue";
import ts from "rollup-plugin-typescript2";
import css from "rollup-plugin-import-css";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

function createEntry(options) {
    const config = {
        input: "./src/index.ts",
        external: ["vue"],
        output: {
            exports: "default",
            file: options.file,
            format: options.format,
            name: "SimpleVueCamera",
        },
        plugins: [
            vue({
                css: true,
                compileTemplate: true,
            }),
            ts(),
            css(),
            resolve(),
            terser(),
        ],
    };

    return config;
}

export default [
    createEntry({
        file: pkg.browser,
        format: "iife",
    }),
    createEntry({
        file: pkg.module,
        format: "es",
    }),
    createEntry({
        file: pkg.main,
        format: "cjs",
    }),
];
