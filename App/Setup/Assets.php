<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

use Snow_Monkey\Plugin\Editor;

class Assets {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'enqueue_block_assets', array( $this, '_enqueue_block_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, '_enqueue_block_editor_extension' ), 9 );
		add_action( 'enqueue_block_editor_assets', array( $this, '_enqueue_block_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, '_wp_enqueue_scripts' ) );
	}

	public function _enqueue_block_assets() {
		if ( apply_filters( 'snow_monkey_editor_enqueue_fallback_style', ! Editor\is_pro() ) ) {
			wp_enqueue_style(
				'snow-monkey-editor@fallback',
				SNOW_MONKEY_EDITOR_URL . '/dist/css/fallback.css',
				array(),
				filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/css/fallback.css' )
			);
		}
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

		wp_set_script_translations(
			'snow-monkey-editor@editor-extension',
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_PATH . '/languages'
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

		wp_set_script_translations(
			'snow-monkey-editor@editor',
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_PATH . '/languages'
		);

		wp_enqueue_style(
			'snow-monkey-editor@editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/css/editor.css',
			array(),
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

		$current_user = wp_get_current_user();
		$roles        = $current_user->roles;
		$role_style   = '';
		foreach ( $roles as $role ) {
			$role_style .= '.sme-hidden-by-role--' . $role . '{opacity: .3}';
		}
		if ( $role_style ) {
			wp_add_inline_style( 'snow-monkey-editor@editor', $role_style );
		}
	}

	/**
	 * Enqueue front assets
	 */
	public function _wp_enqueue_scripts() {
		wp_enqueue_script(
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/js/app.js',
			array(),
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/js/app.js' ),
			true
		);

		wp_enqueue_style(
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/css/app.css',
			array(),
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/css/app.css' )
		);
	}
}
