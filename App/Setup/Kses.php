<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class Kses {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wp_kses_allowed_html', [ $this, '_wp_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Add allowed attributes for br.
	 *
	 * @param array|string $context      Context to judge allowed tags by.
	 * @param string       $context_type Context name.
	 * @return array
	 */
	public function _wp_kses_allowed_html( $context, $context_type ) {
		var_dump(1);exit;
		switch ( $context_type ) {
			case 'post':
				$context['br'] = array_merge(
					$context['br'],
					[
						'class' => true,
					]
				);
				break;
		}
		return $context;
	}
}
