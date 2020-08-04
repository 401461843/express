module.exports = {
	'env': {
		'es6': true,
		'node': true,
		'browser': true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'sourceType': 'script',
	},
	'parser': 'esprima',
	'rules': {
		'no-console': 'off',
		'no-unused-vars': 'error',
		'no-use-before-define': 'error',
		'linebreak-style': [
			'error',
			'unix',
		],
		'quotes': [
			'error',
			'single',
		],
		'semi': [
			'error',
			'always',
		],
		'curly': ['error', 'all'],
		'default-case': 'error',
		'no-else-return': 'error',
		'no-empty-function': 'error',
		'no-implicit-coercion': 'error',
		'no-invalid-this': 'error',
		'no-loop-func': 'error',
		'no-multi-spaces': 'error',
		'no-new-func': 'error',
		'no-useless-return': 'error',
		'global-require': 'error',
		'no-path-concat': 'error',
		'array-bracket-spacing': [
			'error',
			'never', 
		],
		'indent': [
			'error',
			'tab',
		],
		'block-spacing': [
			'error',
			'always',
		],
		'brace-style': [
			'error',
			'1tbs',
		],
		'camelcase': 'error',
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		'comma-spacing': [
			'error',
			{ 'before': false, 'after': true },
		],
		'comma-style': [
			'error',
			'last',
		],
		'key-spacing': [
			'error', 
			{ 'beforeColon': false, 'afterColon': true },
		],
		'lines-around-comment': [
			'error',
			{ 'beforeBlockComment': true },
		],
		'newline-after-var': [
			'error',
			'always',
		],
		'no-multi-assign': 'error',
		'new-cap': [
			'error',
			{
				'newIsCap': true,
				'capIsNew': false,
			},
		],
		'no-multiple-empty-lines': [
			'error',
			{
				'max': 2,
			},
		],
		'no-shadow-restricted-names': 'error',
		'no-undef-init': 'error',
		'keyword-spacing': 'error',
		'space-before-blocks': [
			'error',
			'always',
		],
	},
};