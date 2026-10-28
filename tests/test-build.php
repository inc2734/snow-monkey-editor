<?php
/**
 * Integration tests for the assets produced by the build toolchain.
 */

class Build_Test extends WP_UnitTestCase {

	/**
	 * Editor entry points and their WordPress script handles.
	 *
	 * @return array
	 */
	public static function editor_scripts() {
		return array(
			array( 'editor', 'snow-monkey-editor@editor', '_enqueue_block_editor_assets' ),
			array( 'editor-extension', 'snow-monkey-editor@editor-extension', '_enqueue_block_editor_extension' ),
		);
	}

	/**
	 * Built manifests must resolve the dependencies registered by WordPress.
	 *
	 * @dataProvider editor_scripts
	 * @param string $entry  Build entry point.
	 * @param string $handle Script handle.
	 * @param string $method Enqueue method.
	 */
	public function test_editor_assets_can_be_enqueued( $entry, $handle, $method ) {
		$path = SNOW_MONKEY_EDITOR_PATH . '/dist/js/' . $entry;
		$this->assertFileExists( $path . '.js' );
		$this->assertGreaterThan( 0, filesize( $path . '.js' ) );
		$this->assertFileExists( $path . '.asset.php' );
		$manifest = require $path . '.asset.php';
		$this->assertNotEmpty( $manifest['version'] );
		$this->assertContains( 'wp-blocks', $manifest['dependencies'] );

		$assets = new Snow_Monkey\Plugin\Editor\App\Setup\Assets();
		$assets->$method();
		$this->assertTrue( wp_script_is( $handle, 'enqueued' ) );
		$script = wp_scripts()->registered[ $handle ];
		$this->assertSame( $manifest['dependencies'], $script->deps );
		foreach ( $script->deps as $dependency ) {
			$this->assertTrue( wp_script_is( $dependency, 'registered' ), $dependency );
		}
	}

	/**
	 * The standalone theme fallback and front-end assets must remain available.
	 */
	public function test_front_end_assets_can_be_enqueued() {
		add_filter( 'snow_monkey_editor_pro', '__return_false' );
		wp_dequeue_style( 'sass-basis-core' );
		wp_dequeue_style( 'sass-basis' );
		$assets = new Snow_Monkey\Plugin\Editor\App\Setup\Assets();
		$assets->_enqueue_block_assets();
		$assets->_wp_enqueue_scripts();

		foreach ( array( 'sass-basis-core', 'snow-monkey-editor', 'snow-monkey-editor@front', 'snow-monkey-editor@view' ) as $handle ) {
			$this->assertTrue( wp_style_is( $handle, 'enqueued' ), $handle );
			$style = wp_styles()->registered[ $handle ];
			$path  = str_replace( SNOW_MONKEY_EDITOR_URL, SNOW_MONKEY_EDITOR_PATH, $style->src );
			$this->assertFileExists( $path );
			$this->assertGreaterThan( 0, filesize( $path ) );
		}
		$this->assertTrue( wp_script_is( 'snow-monkey-editor', 'enqueued' ) );
		$this->assertFileExists( SNOW_MONKEY_EDITOR_PATH . '/dist/js/app.js' );
		$this->assertFileExists( SNOW_MONKEY_EDITOR_PATH . '/dist/css/editor.css' );
		remove_filter( 'snow_monkey_editor_pro', '__return_false' );
	}
}
