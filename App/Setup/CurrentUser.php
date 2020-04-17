<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

class CurrentUser {

	public function __construct() {
		add_filter( 'rest_prepare_user', [ $this, '_rest_prepare_user' ], 10, 3 );
	}

	public function _rest_prepare_user( $response, $user, $request ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return $response;
		}

		if ( '/wp/v2/users/me' !== $request->get_route() ) {
			return $response;
		}

		$data = $response->get_data();
		if ( isset( $data['roles'] ) ) {
			return $response;
		}

		$data = array_merge( $data, [ 'roles' => $user->roles ] );
		$response->set_data( $data );

		return $response;
	}
}
