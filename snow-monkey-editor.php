<?php
/**
 * Plugin name: Snow Monkey Editor
 * Version: 11.0.2
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

require_once __DIR__ . '/vendor/autoload.php';

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

/**
 * Whether pro edition.
 *
 * @return boolean
 */
function is_pro() {
	$is_pro = 'snow-monkey' === get_template() || 'snow-monkey/resources' === get_template();
	return apply_filters( 'snow_monkey_editor_pro', $is_pro );
}

/**
 * @codingStandardsIgnoreFile Universal.Files.SeparateFunctionsFromOO.Mixed
 */
class Bootstrap {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, '_bootstrap' ) );

		if ( ! is_admin() ) {
			add_action( 'render_block', array( $this, '_hidden_by_roles' ), 10, 2 );
			add_action( 'render_block', array( $this, '_date_time' ), 10, 2 );
			add_action( 'render_block', array( $this, '_ordered_list_counter' ), 10, 2 );
			add_action( 'render_block', array( $this, '_animation_delay' ), 10, 2 );
			add_action( 'render_block', array( $this, '_animation_duration' ), 10, 2 );
			add_action( 'init', array( $this, '_add_attributes_to_blocks' ), 11 );
		}
	}

	/**
	 * Bootstrap.
	 */
	public function _bootstrap() {
		add_filter( 'load_textdomain_mofile', array( $this, '_load_textdomain_mofile' ), 10, 2 );
		add_filter( 'init', array( $this, '_init' ) );

		new App\Setup\Assets();
		new App\Setup\BlockStyles();
		new App\Setup\CurrentUser();
		new App\Setup\Endpoint();
	}

	/**
	 * When local .mo file exists, load this.
	 *
	 * @param string $mofile Path to the MO file.
	 * @param string $domain Text domain. Unique identifier for retrieving translated strings.
	 * @return string
	 */
	public function _load_textdomain_mofile( $mofile, $domain ) {
		if ( 'snow-monkey-editor' !== $domain ) {
			return $mofile;
		}

		$mofilename   = basename( $mofile );
		$local_mofile = SNOW_MONKEY_EDITOR_PATH . '/languages/' . $mofilename;
		if ( ! file_exists( $local_mofile ) ) {
			return $mofile;
		}

		return $local_mofile;
	}

	/**
	 * Load textdomain.
	 */
	public function _init() {
		load_plugin_textdomain(
			'snow-monkey-editor',
			false,
			basename( SNOW_MONKEY_EDITOR_PATH ) . '/languages'
		);
	}

	/**
	 * Apply hidden by roles setting to blocks.
	 *
	 * @param string $content The block content about to be appended.
	 * @param array  $block   The full block, including name and attributes.
	 * @return string
	 */
	public function _hidden_by_roles( $content, $block ) {
		if ( ! isset( $block['attrs'] ) ) {
			return $content;
		}

		$attributes          = $block['attrs'];
		$has_hidden_by_roles = isset( $attributes['smeIsHiddenRoles'] ) ? $attributes['smeIsHiddenRoles'] : false;
		if ( $has_hidden_by_roles ) {
			$user = wp_get_current_user();
			foreach ( $has_hidden_by_roles as $role ) {
				if (
					in_array( $role, (array) $user->roles, true )
					|| ( 'sme-guest' === $role && ! $user->roles )
				) {
					return '';
				}
			}
		}
		return $content;
	}

	/**
	 * Apply datetime setting to blocks.
	 *
	 * @param string $content The block content about to be appended.
	 * @param array  $block   The full block, including name and attributes.
	 * @return string
	 */
	public function _date_time( $content, $block ) {
		if ( ! isset( $block['attrs'] ) ) {
			return $content;
		}

		// Dates entered in the block editor are localized.
		$attributes      = $block['attrs'];
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
	 * Set counter to ordered list.
	 *
	 * @param string $content The block content about to be appended.
	 * @param array  $block   The full block, including name and attributes.
	 * @return string
	 */
	public function _ordered_list_counter( $content, $block ) {
		if ( 'core/list' !== $block['blockName'] ) {
			return $content;
		}

		if ( ! isset( $block['attrs'] ) ) {
			return $content;
		}

		$attributes = $block['attrs'];
		$class_name = isset( $attributes['className'] ) ? $attributes['className'] : false;

		if ( ! $class_name || ! isset( $attributes['ordered'] ) ) {
			return $content;
		}

		$is_ol_circle = strpos( $class_name, 'is-style-sme-ordered-list-circle' );
		$is_ol_square = strpos( $class_name, 'is-style-sme-ordered-list-square' );

		if ( false !== $is_ol_circle || false !== $is_ol_square ) {
			$start     = ! empty( $attributes['start'] ) ? $attributes['start'] : 1;
			$sme_count = ! empty( $attributes['reversed'] )
				? 'sme-count ' . ( $start + 1 )
				: 'sme-count ' . ( $start - 1 );
			$content   = preg_replace(
				'|^<ol|ms',
				'<ol style="counter-reset: ' . esc_attr( $sme_count ) . '"',
				$content
			);
		}

		return $content;
	}

	/**
	 * Set animation delay
	 *
	 * @param string $content The block content about to be appended.
	 * @param array  $block   The full block, including name and attributes.
	 * @return string
	 */
	public function _animation_delay( $content, $block ) {
		if ( ! isset( $block['attrs'] ) ) {
			return $content;
		}

		$attributes = $block['attrs'];
		$delay      = isset( $attributes['smeAnimationDelay'] )
			? $attributes['smeAnimationDelay']
			: false;

		if ( 0 >= $delay ) {
			return $content;
		}

		return preg_replace(
			'|(\/?>)|ms',
			' data-sme-animation-delay="' . esc_attr( $delay ) . '"$1',
			$content,
			1
		);
	}

	/**
	 * Set animation duration
	 *
	 * @param string $content The block content about to be appended.
	 * @param array  $block   The full block, including name and attributes.
	 * @return string
	 */
	public function _animation_duration( $content, $block ) {
		if ( ! isset( $block['attrs'] ) ) {
			return $content;
		}

		$attributes = $block['attrs'];
		$duration   = isset( $attributes['smeAnimationDuration'] )
			? $attributes['smeAnimationDuration']
			: false;

		if ( 0 >= $duration ) {
			return $content;
		}

		return preg_replace(
			'|(\/?>)|ms',
			' data-sme-animation-duration="' . esc_attr( $duration ) . '"$1',
			$content,
			1
		);
	}

	/**
	 * Adds attributes to all blocks, to avoid `Invalid parameter(s): attributes` error in Gutenberg.
	 *
	 * @see https://github.com/Codeinwp/gutenberg-animation/blob/a0efe29a3ce023e0f562bb9a51d34b345431b642/class-gutenberg-animation.php#L105-L119
	 */
	public function _add_attributes_to_blocks() {
		$attributes = array();
		foreach ( glob( SNOW_MONKEY_EDITOR_PATH . '/src/extension/*', GLOB_ONLYDIR ) as $dir ) {
			foreach ( glob( $dir . '/attributes.json' ) as $file ) {
				$_attributes = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				$_attributes = json_decode( $_attributes, true );
				$attributes  = array_merge( $attributes, $_attributes );
			}
		}

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		foreach ( $registered_blocks as $name => $block ) {
			if ( ! isset( $block->attributes ) || ! is_array( $block->attributes ) ) {
				$block->attributes = array();
			}
			foreach ( $attributes as $name => $detail ) {
				$block->attributes[ $name ] = $detail;
			}
		}
	}
}

new \Snow_Monkey\Plugin\Editor\Bootstrap();
