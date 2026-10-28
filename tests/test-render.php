<?php
/**
 * Regression tests for saved extension attributes and front-end rendering.
 */

class Render_Test extends WP_UnitTestCase {

	/**
	 * Extension attributes must survive saving and rendering a core block.
	 */
	public function test_saved_animation_attributes_are_rendered() {
		$attributes = array(
			'smeAnimation'         => 'fade-in',
			'smeAnimationDelay'    => 0.5,
			'smeAnimationDuration' => 1.5,
			'smeIsHiddenSm'        => true,
		);
		$block      = array(
			'blockName'    => 'core/paragraph',
			'attrs'        => $attributes,
			'innerBlocks'  => array(),
			'innerHTML'    => '<p class="sme-animation-fade-in sme-hidden-sm">Toolchain regression</p>',
			'innerContent' => array( '<p class="sme-animation-fade-in sme-hidden-sm">Toolchain regression</p>' ),
		);
		$post_id    = self::factory()->post->create( array( 'post_content' => serialize_block( $block ) ) );
		$content    = get_post_field( 'post_content', $post_id );
		$parsed     = parse_blocks( $content );
		$this->assertSame( $attributes, $parsed[0]['attrs'] );

		$type = WP_Block_Type_Registry::get_instance()->get_registered( 'core/paragraph' );
		foreach ( $attributes as $name => $value ) {
			$this->assertArrayHasKey( $name, $type->attributes );
		}
		$rendered = do_blocks( $content );
		$this->assertStringContainsString( 'Toolchain regression', $rendered );
		$this->assertStringContainsString( 'sme-animation-fade-in sme-hidden-sm', $rendered );
		$this->assertStringContainsString( 'data-sme-animation-delay="0.5"', $rendered );
		$this->assertStringContainsString( 'data-sme-animation-duration="1.5"', $rendered );
	}

	/**
	 * Guest visibility must still apply to saved blocks.
	 */
	public function test_guest_visibility_is_preserved() {
		wp_set_current_user( 0 );
		$content = '<!-- wp:paragraph {"smeIsHiddenRoles":["sme-guest"]} --><p>Members only</p><!-- /wp:paragraph -->';
		$this->assertSame( '', do_blocks( $content ) );

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );
		$this->assertStringContainsString( 'Members only', do_blocks( $content ) );
	}
}
