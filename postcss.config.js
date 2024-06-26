/** The css files in this project is based on postcss. */
/** View postcss.config.js & https://www.postcss.parts/ to see more. */
/*
 * avilable features:
 * css nesting
 * tailwindcss features
 * auto prefixing
 * cssnano
 */

export default {
  plugins: {
    // postcss integration pack
    "tailwindcss/nesting": {},
    // code compression for css
    cssnano: { preset: "default" },
    // tailwindcss features
    tailwindcss: {},
    // browser compatibility
    autoprefixer: {},
  },
};