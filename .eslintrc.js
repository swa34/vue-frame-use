module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'node': true
	},
	'extends': [
		// 'eslint:recommended',
		'plugin:vue/recommended'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'vue'
	],
	'rules': {
		// JavaScript
		'indent': [
			'error',
			'tab',
			{ 'SwitchCase': 1 }
		],
		'linebreak-style': [ 'error', 'unix' ],
		'quotes': [ 'error', 'single' ],
		'semi': [ 'error', 'always' ],
		// Vue
		'vue/html-indent': [ 'error', 'tab' ],
		'vue/html-self-closing': [
			'error',
			{ 'html': { 'normal': 'never', 'void': 'always' } }
		],
		'vue/max-attributes-per-line': [
			'error',
			{ 'singleline': 3, 'multiline': 3 }
		],
		'vue/script-indent': [
			'error',
			'tab',
			{ 'baseIndent': 1, 'switchCase': 1 }
		]
	},
	'overrides': [
		// Need this override to use the vue/script-indent rule
		{
			'files': ['*.vue'],
			'rules': { 'indent': 'off' }
		}
	]
};
