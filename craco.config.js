const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    plugins: {
      add: [
        new ESLintPlugin({
          extensions: ["js", "jsx", "ts", "tsx"],
        }),
      ],
    },
  },
};
