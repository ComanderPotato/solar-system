const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/core/index.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/data", to: "data" },
        { from: "src/styles", to: "styles" },
      ],
    }),
  ],
  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, "dist"),
  //   },
  //   compress: true,
  //   port: 9000,
  //   proxy: {
  //     "/api": {
  //       target: "https://api.le-systeme-solaire.net",
  //       changeOrigin: true,
  //       pathRewrite: { "^/api": "" },
  //       secure: false,
  //     },
  //   },
  // },
};
