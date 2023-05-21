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
		$post_type    = get_post_type();
		$capabilities = get_post_type_capabilities( get_post_type_object( $post_type ) );

		$data = ! current_user_can( $capabilities->edit_posts )
			? array(
				'id'    => $current_user->data->ID,
				'name'  => $current_user->data->user_login,
				'slug'  => $current_user->data->user_nicename,
				'roles' => $current_user->roles,
			)
			: array();

		wp_localize_script(
			'snow-monkey-editor@editor-extension',
			'snowmonkeyeditor',
			array(
				'currentUser' => $data,
			)
		);
	}
}
