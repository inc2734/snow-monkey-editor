<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class CurrentUser {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, '_wp_enqueue_scripts' ], 9 );
	}

	/**
	 * Add user data to script.
	 */
	public function _wp_enqueue_scripts() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$current_user = wp_get_current_user();
		$data         = [
			'id'    => $current_user->data->ID,
			'name'  => $current_user->data->user_login,
			'slug'  => $current_user->data->user_nicename,
			'roles' => $current_user->roles,
		];

		wp_localize_script(
			'snow-monkey-editor@editor-extension',
			'snowmonkeyeditor',
			[
				'currentUser' => $data,
			]
		);
	}
}
