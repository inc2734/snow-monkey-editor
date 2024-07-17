<?php
/**
 * @package snow-monkey-editor
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Snow_Monkey\Plugin\Editor\App\Setup;

use Snow_Monkey\Plugin\Editor;

class BlockStyles {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, '_init' ) );
	}

	/**
	 * Register block styles.
	 */
	public function _init() {
		register_block_style(
			array( 'core/group', 'core/paragraph' ),
			array(
				'name'  => 'sme-alert',
				'label' => __( 'Alert', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/group', 'core/paragraph' ),
			array(
				'name'  => 'sme-alert-remark',
				'label' => __( 'Alert (Remarks)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/group', 'core/paragraph' ),
			array(
				'name'  => 'sme-alert-success',
				'label' => __( 'Alert (Success)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/group', 'core/paragraph' ),
			array(
				'name'  => 'sme-alert-warning',
				'label' => __( 'Alert (Warning)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/code',
			array(
				'name'  => 'sme-block-code-nowrap',
				'label' => __( 'No wrap', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/code',
			array(
				'name'  => 'sme-block-code-wrap',
				'label' => __( 'Wrap', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/image', 'core/media-text' ),
			array(
				'name'  => 'sme-fluid-shape-1',
				'label' => __( 'Fluid Shape 1', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/image', 'core/media-text' ),
			array(
				'name'  => 'sme-fluid-shape-2',
				'label' => __( 'Fluid Shape 2', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			array( 'core/image', 'core/media-text' ),
			array(
				'name'  => 'sme-fluid-shape-3',
				'label' => __( 'Fluid Shape 3', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-list-arrow',
				'label' => __( 'Arrow', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-list-check',
				'label' => __( 'Check', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-list-remark',
				'label' => __( 'Remark', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-list-times',
				'label' => __( 'Times', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-ordered-list-circle',
				'label' => __( 'Ordered list (Circle)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/list',
			array(
				'name'  => 'sme-ordered-list-square',
				'label' => __( 'Ordered list (Square)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-post-it',
				'label' => __( 'Post-it', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-post-it-narrow',
				'label' => __( 'Post-it (Narrow)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-speech',
				'label' => __( 'Speech (Bottom)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-speech-left',
				'label' => __( 'Speech (Left)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-speech-right',
				'label' => __( 'Speech (Right)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/paragraph',
			array(
				'name'  => 'sme-speech-top',
				'label' => __( 'Speech (Top)', 'snow-monkey-editor' ),
			)
		);

		register_block_style(
			'core/image',
			array(
				'name'       => 'sme-shadowed',
				'label'      => __( 'Shadowed', 'snow-monkey-editor' ),
				'style_data' => array(
					'shadow' => '0 0 4px 0 rgba(0 0 0 / .1)',
				),
			)
		);

		register_block_style(
			'core/button',
			array(
				'name'       => 'sme-shadowed',
				'label'      => __( 'Shadowed', 'snow-monkey-editor' ),
				'style_data' => array(
					'shadow' => '0 1px 3px 0 rgb(0 0 0 / 0.25), 0 1px 0 0 rgb(255 255 255 / .1) inset, 0 -1px 0 0 rgb(1 1 1 / .05) inset',
				),
			)
		);
	}
}
