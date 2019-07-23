const common									= require('./webpack.common.js');
// const CompressionPlugin				= require('compression-webpack-plugin');
const merge										= require('webpack-merge');
const MiniCssExtractPlugin		= require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin	= require('optimize-css-assets-webpack-plugin');
const TerserPlugin						= require('terser-webpack-plugin');
const webpack									= require('webpack');

module.exports = merge(common, {
	devtool: 'source-map',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCSSAssetsPlugin()
		]
	},
	plugins: [
		// new CompressionPlugin({
		// 	test: /\.js$|\.css$|\.html$/,
		// 	minRatio: 0.8
		// }),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	resolve: {
		alias: {
			vue: 'vue/dist/vue.min'
		}
	}
});
