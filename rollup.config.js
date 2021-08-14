import vue from "rollup-plugin-vue";
import ts from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
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
            postcss(),
        ],
    };

    return config;
}

export default [
    createEntry({
        file: pkg.main,
        format: "umd",
    }),
];
