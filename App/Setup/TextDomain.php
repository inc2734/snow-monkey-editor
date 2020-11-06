<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class TextDomain {

	/**
	 * Constructor.
	 */
	public function __construct() {
		load_plugin_textdomain(
			'snow-monkey-editor',
			false,
			basename( SNOW_MONKEY_EDITOR_PATH ) . '/languages'
		);

		add_filter( 'load_textdomain_mofile', [ $this, '_load_textdomain_mofile' ], 10, 2 );
		add_action( 'enqueue_block_editor_assets', [ $this, '_set_script_translations' ], 11 );
	}

	/**
	 * When local .mo file exists, load this.
	 *
	 * @param string $mofile Path to the MO file.
	 * @param string $domain Text domain. Unique identifier for retrieving translated strings.
	 * @return string
	 */
	public function _load_textdomain_mofile( $mofile, $domain ) {
		if ( 'snow-monkey-editor' === $domain ) {
			$mofilename   = basename( $mofile );
			$local_mofile = SNOW_MONKEY_EDITOR_PATH . '/languages/' . $mofilename;
			if ( file_exists( $local_mofile ) ) {
				return $local_mofile;
			}
		}
		return $mofile;
	}

	/**
	 * Translate script files
	 */
	public function _set_script_translations() {
		wp_set_script_translations(
			'snow-monkey-editor@editor',
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_PATH . '/languages'
		);

		wp_set_script_translations(
			'snow-monkey-editor@editor-extension',
			'snow-monkey-editor',
			SNOW_MONKEY_EDITOR_PATH . '/languages'
		);
	}
}
