<?php
/**
 * Plugin name: Snow Monkey Editor
 * Version: 0.0.1
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

use Inc2734\WP_GitHub_Plugin_Updater\Bootstrap as Updater;

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
	}

	public function _bootstrap() {
		new App\Setup\TextDomain();
		new App\Setup\Assets();

		add_action( 'init', [ $this, '_activate_autoupdate' ] );
	}

	/**
	 * Activate auto update using GitHub
	 *
	 * @return void
	 */
	public function _activate_autoupdate() {
		new Updater(
			plugin_basename( __FILE__ ),
			'inc2734',
			'snow-monkey-editor'
		);
	}
}

new \Snow_Monkey\Plugin\Editor\Bootstrap();
