import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
const banner = `/*!
 * ts-flow
 * by LorestaniMe <dyniqo@gmail.com>
 * https://github.com/Dyniqo/ts-flow
 * License MIT
 */
`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/ts-flow.cjs.js",
        format: "cjs",
        sourcemap: true,
        banner
      },
      {
        file: "dist/ts-flow.esm.js",
        format: "esm",
        sourcemap: true,
        banner
      },
      {
        file: "dist/ts-flow.cjs.min.js",
        format: "cjs",
        sourcemap: true,
        plugins: [terser()],
        banner,
      },
      {
        file: "dist/ts-flow.esm.min.js",
        format: "esm",
        sourcemap: true,
        plugins: [terser()],
        banner,
      },
      {
        file: "dist/ts-flow.amd.js",
        format: "amd",
        sourcemap: true,
        banner,
      },
      {
        file: "dist/ts-flow-iife.js",
        format: "iife",
        sourcemap: true,
        banner,
      },
      {
        file: "dist/ts-flow.iife.min.js",
        format: "iife",
        sourcemap: true,
        plugins: [terser()],
        banner,
      },
    ],
    external: [],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },

  {
    input: "./dist/index.d.ts",
    output: [{ file: "dist/ts-flow.d.ts", format: "es" }],
    plugins: [
      dts(``),
      del({
        targets: [
          "dist/**/*",
          "!dist/*.js",
          "!dist/*.map",
          "!dist/types/**/*",
          "!dist/ts-flow.d.ts",
        ],
        hook: "buildEnd",
      }),
    ],
  },
];
