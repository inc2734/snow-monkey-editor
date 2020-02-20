<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;
use Snow_Monkey\Plugin\Editor\App\Setup\Assets;

class BaseFont extends Assets {

	public function _enqueue_block_editor_assets() {
		parent::_enqueue_block_editor_assets();
		
		$basefont = ( get_theme_mod('base-font') ) ? get_theme_mod('base-font') : '';
		$loadfontweight = ( get_theme_mod('load-font-weight') ) ? get_theme_mod('load-font-weight') : '400,700';

		wp_localize_script('snow-monkey-editor@editor', 'BaseFont', [
	        'name' => $basefont,
	        'weight' => $loadfontweight,
	    ] );
	}
}
