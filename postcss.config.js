module.exports = ({ file, options, env }) => ({
	parser: false,
	plugins: {
		'postcss-import': { root: file.dirname },
		'postcss-preset-env': {},
		'cssnano': true
	}
});
