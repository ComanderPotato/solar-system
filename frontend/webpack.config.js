const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: "./src/index.ts",
	mode: "development",
	// mode: "production",
	// devtool: "inline-source-map",
	devtool: "eval-cheap-module-source-map",
	// devtool: false,
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
				// options: {
				// 	cacheDirectory: true,
				// },
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				type: "asset/source",
				use: ["glslify-loader"],
			},
			// {
			// 	test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
			// 	type: "asset/resource",
			// },
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
				},
			}),
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html", // source file
			filename: "index.html", // output in dist/
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/assets", to: "assets" },
				{ from: "src/data", to: "data" },
				{ from: "src/styles", to: "styles" },
			],
		}),
	],
};
// module.exports = {
//   entry: "./src/core/index.ts",
//   mode: "production",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "bundle.js",
//   },
//   resolve: {
//     extensions: [".ts", ".js"],
//   },
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin()],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         { from: "src/assets", to: "assets" },
//         { from: "src/data", to: "data" },
//         { from: "src/styles", to: "styles" },
//       ],
//     }),
//   ],
// };
// "build": "rimraf dist && tsc && webpack && cpy dist/**/* ../backend/static/src --parents"
