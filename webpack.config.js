const CleanWebpackPlugin	= require('clean-webpack-plugin');
const HtmlWebpackPlugin		= require('html-webpack-plugin');
const pkg									= require('./package.json');
const path								= require('path');

const resolve = dir => path.join(__dirname, dir);

module.exports = (env, argv) => {
	return {
		entry: './src/index.js',
		devtool: 'source-map',
		mode: 'development',
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new HtmlWebpackPlugin({
				title: pkg.name,
				template: './src/index.html'
			})
		],
		resolve: {
			extensions: [
				'.js',
				'.vue',
				'.json'
			],
			alias: {
				'@': resolve('src'),
				vue: argv['mode'] === 'production' ? 'vue/dist/vue.min' : 'vue/dist/vue'
			}
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['babel-preset-env']
						}
					}
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						'css-loader'
					]
				},
				{
					test: /\.scss$/,
					use: [
						'style-loader',
						'css-loader',
						'sass-loader'
					]
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				}
			]
		},
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist')
		}
	};
};
