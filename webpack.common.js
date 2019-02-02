const CleanWebpackPlugin	= require('clean-webpack-plugin');
const path								= require('path');
const { VueLoaderPlugin }	= require('vue-loader');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
	entry: {
		'gacounts.singlepage': path.join(__dirname, 'src/index.js')
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new VueLoaderPlugin()
	],
	resolve: {
		extensions: [
			'.js',
			'.vue',
			'.json'
		],
		alias: {
			'@': resolve('src')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(superagent)\/)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-object-rest-spread']
					}
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
