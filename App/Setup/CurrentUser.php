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
		add_action( 'enqueue_block_editor_assets', array( $this, '_wp_enqueue_scripts' ), 9 );
	}

	/**
	 * Add user data to script.
	 */
	public function _wp_enqueue_scripts() {
		$current_user = wp_get_current_user();

		wp_localize_script(
			'snow-monkey-editor@editor-extension',
			'snowmonkeyeditor',
			array(
				'currentUser' => array(
					'id'    => $current_user->ID,
					'name'  => isset( $current_user->data->user_login ) ? $current_user->data->user_login : null,
					'slug'  => isset( $current_user->data->user_nicename ) ? $current_user->data->user_nicename : null,
					'roles' => $current_user->roles,
				),
			)
		);
	}
}
