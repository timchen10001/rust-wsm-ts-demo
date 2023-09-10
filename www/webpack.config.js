const path = require("path");
const { SourceMapDevToolPlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./bootstrap.js",
  output: {
    filename: "bootstrap.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: "[file].map[query]",
      exclude: ["vendor.js"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./index.html",
          to: "./",
        },
        {
          from: "./styles.css",
          to: "./",
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
