const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/vendor/**',
			'webpack.config.js',
			'postcss.config.js',
		],
	},
	...defaultConfig,
	{
		files: [ 'src/**/*.js' ],
		languageOptions: {
			globals: {
				IntersectionObserver: 'writable',
				snowmonkeyeditor: 'writable',
			},
		},
		rules: {
			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': [
				'error',
				{
					ignore: [ '^@wordpress/' ],
				},
			],
			'@wordpress/no-unsafe-wp-apis': 'off',
			eqeqeq: 'off',
		},
	},
];
