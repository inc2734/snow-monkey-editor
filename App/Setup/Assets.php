<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

use Snow_Monkey\Plugin\Editor;

class Assets {
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, '_enqueue_block_editor_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, '_wp_enqueue_scripts' ] );
	}

	/**
	 * Enqueue editor assets
	 *
	 * @return void
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
	}

	/**
	 * Enqueue front assets
	 *
	 * @return void
	 */
	public function _wp_enqueue_scripts() {
		wp_enqueue_style(
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_URL . '/dist/css/app.css',
			[],
			filemtime( SNOW_MONKEY_EDITOR_PATH . '/dist/css/app.css' )
		);
	}
}
