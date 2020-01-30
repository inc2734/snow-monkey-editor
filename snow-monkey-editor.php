<?php
/**
 * Plugin name: Snow Monkey Editor
 * Version: 0.6.0
 * Description: Extends gutenberg block editor
 * Author: inc2734
 * Author URI: https://2inc.org
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: snow-monkey-editor
 *
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor;

use WP_Block_Type_Registry;

require_once( __DIR__ . '/vendor/autoload.php' );

/**
 * Directory url of this plugin
 *
 * @var string
 */
define( 'SNOW_MONKEY_EDITOR_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

/**
 * Directory path of this plugin
 *
 * @var string
 */
define( 'SNOW_MONKEY_EDITOR_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

class Bootstrap {

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, '_bootstrap' ] );

		if ( ! is_admin() ) {
			add_action( 'render_block', [ $this, '_hidden_by_roles' ], 10, 2 );
			add_action( 'render_block', [ $this, '_date_time' ], 10, 2 );
			add_action( 'init', array( $this, '_add_attributes_to_blocks' ), 11 );
		}
	}

	public function _bootstrap() {
		foreach ( glob( SNOW_MONKEY_EDITOR_PATH . '/App/Setup/*.php' ) as $file ) {
			$class_name = '\\Snow_Monkey\\Plugin\\Editor\\App\\Setup\\' . str_replace( '.php', '', basename( $file ) );
			if ( class_exists( $class_name ) ) {
				new $class_name();
			}
		}
	}

	public function _hidden_by_roles( $content, $block ) {
		$attributes = $block['attrs'];
		$has_hidden_by_roles = isset( $attributes['smeIsHiddenRoles'] ) ? $attributes['smeIsHiddenRoles'] : false;
		if ( $has_hidden_by_roles ) {
			$user = wp_get_current_user();
			foreach ( $has_hidden_by_roles as $role ) {
				if ( in_array( $role, (array) $user->roles ) || 'sme-guest' === $role && ! $user->roles ) {
					return '';
				}
			}
		}
		return $content;
	}

	public function _date_time( $content, $block ) {
		// Dates entered in the block editor are localized.
		$attributes = $block['attrs'];
		$start_date_time = isset( $attributes['smeStartDateTime'] ) ? $attributes['smeStartDateTime'] : false;
		$end_date_time   = isset( $attributes['smeEndDateTime'] ) ? $attributes['smeEndDateTime'] : false;

		if ( ! $start_date_time && ! $end_date_time ) {
			return $content;
		}

		$current_date_time = wp_date( 'Y-m-d\TH:i:s' );
		$current_date_time = strtotime( $current_date_time );

		if ( $start_date_time ) {
			$start_date_time = strtotime( $start_date_time );

			if ( $start_date_time > $current_date_time ) {
				return '';
			}
		}

		if ( $end_date_time ) {
			$end_date_time = strtotime( $end_date_time );

			if ( $end_date_time < $current_date_time ) {
				return '';
			}
		}

		return $content;
	}

	/**
	 * Adds attributes to all blocks, to avoid `Invalid parameter(s): attributes` error in Gutenberg.
	 *
	 * @see https://plugins.trac.wordpress.org/browser/blocks-animation/trunk/vendor/codeinwp/gutenberg-animation/class-gutenberg-animation.php#L109
	 */
	public function _add_attributes_to_blocks() {
		$attributes = [];
		foreach ( glob( SNOW_MONKEY_EDITOR_PATH . '/src/extension/*', GLOB_ONLYDIR ) as $dir ) {
			foreach ( glob( $dir . '/attributes.php' ) as $file ) {
				$attributes = array_merge( $attributes, include( $file ) );
			}
		}

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		foreach ( $registered_blocks as $name => $block ) {
			foreach ( $attributes as $name => $detail ) {
				$block->attributes[ $name ] = $detail;
			}
		}
	}
}

new \Snow_Monkey\Plugin\Editor\Bootstrap();
