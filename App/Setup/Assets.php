<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class Assets {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, '_enqueue_block_editor_extension' ], 9 );
		add_action( 'enqueue_block_editor_assets', [ $this, '_enqueue_block_editor_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, '_wp_enqueue_scripts' ] );
	}

	/**
	 * Enqueue editor extension
	 */
	public function _enqueue_block_editor_extension() {
		$asset = include( SNOW_MONKEY_EDITOR_PATH . '/dist/js/editor-extension.asset.php' );
		wp_enqueue_script(
			'snow-monkey-editor@editor-extension',
			SNOW_MONKEY_EDITOR_URL . '/dist/js/editor-extension.js',
			$asset['dependencies'],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/js/editor-extension.js' ),
			true
		);
	}

	/**
	 * Enqueue editor assets
	 */
	public function _enqueue_block_editor_assets() {
		$asset = include( SNOW_MONKEY_EDITOR_PATH . '/dist/js/editor.asset.php' );
		wp_enqueue_script(
			'snow-monkey-editor@editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/js/editor.js',
			$asset['dependencies'],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/js/editor.js' ),
			true
		);

		wp_enqueue_style(
			'snow-monkey-editor@editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/css/editor.css',
			[],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/css/editor.css' )
		);

		$palette     = get_theme_support( 'editor-color-palette' );
		$color_style = '';
		if ( is_array( $palette ) && ! empty( $palette ) ) {
			foreach ( $palette[0] as $color ) {
				$color_style .= ':root .editor-styles-wrapper .has-' . esc_attr( $color['slug'] ) . '-color[class*="sme-"],:root .customize-control-sidebar_block_editor .has-' . esc_attr( $color['slug'] ) . '-color[class*="sme-"]{color:' . esc_attr( $color['color'] ) . '}';
				$color_style .= ':root .editor-styles-wrapper .has-' . esc_attr( $color['slug'] ) . '-background-color[class*="sme-"],:root .customize-control-sidebar_block_editor .has-' . esc_attr( $color['slug'] ) . '-background-color[class*="sme-"]{background-color:' . esc_attr( $color['color'] ) . '}';
			}
			if ( $color_style ) {
				wp_add_inline_style( 'snow-monkey-editor@editor', $color_style );
			}
		}
	}

	/**
	 * Enqueue front assets
	 */
	public function _wp_enqueue_scripts() {
		wp_enqueue_script(
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/js/app.js',
			[],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/js/app.js' ),
			true
		);

		wp_enqueue_style(
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/css/app.css',
			[],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/css/app.css' )
		);
	}
}
