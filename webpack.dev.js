const common			= require('./webpack.common.js');
const merge				= require('webpack-merge');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-eval-source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
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
					'vue-style-loader',
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
	resolve: {
		alias: {
			vue: 'vue/dist/vue'
		}
	}
});
