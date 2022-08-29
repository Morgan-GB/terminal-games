import esbuild from "rollup-plugin-esbuild"

/** @type {import('rollup'.RollupOptions)} */
export default {
  input: {
    index: "src/index.ts",
    games: "src/games/index.ts"
  },
  output: {
    dir: "dist",
    format: "esm",
    chunkFileNames: "[name].js"
  },

  plugins: [
    esbuild({
      target: "esnext"
    })
  ]
}