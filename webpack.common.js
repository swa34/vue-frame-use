const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
	entry: {
		'gacounts.singlepage': path.join(__dirname, 'src/gacounts.singlepage.js'),
		'researchfarm.publicform': path.join(__dirname, 'src/researchfarm.publicform.js')
	},
	plugins: [
		new CleanWebpackPlugin(),
		new Visualizer(),
		new VueLoaderPlugin()
	],
	resolve: {
		extensions: [
			'.js',
			'.vue',
			'.json'
		],
		alias: {
			'~': resolve('src')
		}
	},
	module: {
		rules: [
			// Enabling this chunk will prevent builds from compiling if the linting
			// rules are not adhered to.  It's disabled for now because the codebase
			// is a mess and needs to be cleaned up but I don't have time right now.
			// Just wanted to leave it here, commented, so I don't forget to
			// eventually implement it.
			// {
			// 	enforce: 'pre',
			// 	test: /\.(js|vue)$/,
			// 	loader: 'eslint-loader',
			// 	exclude: /node_modules/
			// },
			{
				test: /\.js$/u,
				// exclude: /node_modules\/(?!(superagent)\/)/u,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							'@babel/plugin-transform-regenerator',
							'@babel/plugin-proposal-object-rest-spread'
						]
					}
				}
			},
			{
				test: /\.vue$/u,
				loader: 'vue-loader'
			}
		]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
