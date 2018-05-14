const CleanWebpackPlugin	= require('clean-webpack-plugin');
const CompressionPlugin		= require('compression-webpack-plugin');
const HtmlWebpackPlugin		= require('html-webpack-plugin');
const path								= require('path');
const pkg									= require('./package.json');
const webpack							= require('webpack');
const { VueLoaderPlugin }	= require('vue-loader');

const resolve = dir => path.join(__dirname, dir);

const commonConfig = {
	entry: './src/index.js',
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './src/index.html'
		}),
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
					'vue-style-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
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

// Additional options specific to development mode
const devPatch = {
	resolve: {
		alias: {
			vue: 'vue/dist/vue'
		}
	}
};

// Additional options specific to production mode
const prodPatch = {
	resolve: {
		alias: {
			vue: 'vue/dist/vue.min'
		}
	}
};

// Create the two configs
const devConfig = Object.assign(devPatch, commonConfig);
const prodConfig = Object.assign(prodPatch, commonConfig);

// Apply some optimizations to the production config
prodConfig.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
prodConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
prodConfig.plugins.push(new CompressionPlugin({
	asset: '[path].gz[query]',
	algorithm: 'gzip',
	test: /\.js$|\.css$|\.html$/,
	threshold: 10240,
	minRatio: 0
}));

module.exports = (env, argv) => {
	return argv['mode'] === 'production' ? prodConfig : devConfig;
};
