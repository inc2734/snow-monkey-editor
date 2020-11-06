<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class Endpoint {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, '_rest_api_init' ] );
	}

	/**
	 * Return roles.
	 */
	public function _rest_api_init() {
		register_rest_route(
			'snow-monkey-editor/v1',
			'/roles',
			[
				'methods'             => 'GET',
				'callback'            => function() {
					if ( ! function_exists( '\\get_editable_roles' ) ) {
						require_once( ABSPATH . '/wp-admin/includes/user.php' );
					}

					$roles          = [];
					$editable_roles = get_editable_roles();
					foreach ( $editable_roles as $role => $detail ) {
						$roles[ $role ] = array_merge(
							$detail,
							[
								'name' => translate_user_role( $detail['name'] ),
							]
						);
					}
					return $roles;
				},
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			]
		);
	}
}
