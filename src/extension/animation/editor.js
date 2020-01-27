'use select';

import {
	difference,
} from 'lodash';

import classnames from 'classnames';

import {
	hasBlockSupport,
	getBlockType,
} from '@wordpress/blocks';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
} from '@wordpress/components';

import {
	addFilter,
} from '@wordpress/hooks';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	__,
} from '@wordpress/i18n';

import {
	icon,
} from '../../helper/icon';

import {
	classes,
} from './helper';

import customAttributes from './attributes';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/animation/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			...customAttributes,
		};
		return settings;
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/animation/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					setAttributes,
					name,
				} = props;

				const {
					smeAnimation,
					className,
				} = attributes;

				if ( 'undefined' === typeof smeAnimation ) {
					return <BlockEdit { ...props } />;
				}

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				if ( ! hasBlockSupport( blockType, 'customClassName', true ) ) {
					return <BlockEdit { ...props } />;
				}

				const options = [
					{ label: '', value: '' },
					{ label: __( 'bounce-in', 'snow-monkey-editor' ), value: 'bounce-in' },
					{ label: __( 'bounce-down', 'snow-monkey-editor' ), value: 'bounce-down' },
					{ label: __( 'fade-in', 'snow-monkey-editor' ), value: 'fade-in' },
				];

				return (
					<>
						<BlockEdit { ...props } />

						<InspectorControls>
							<PanelBody
								title={ __( 'Animation', 'snow-monkey-editor' ) }
								initialOpen={ false }
								icon={ icon }
								className={ !! smeAnimation ? 'sme-extension-panel sme-extension-panel--enabled' : 'sme-extension-panel' }
							>
								<SelectControl
									label={ __( 'Animation', 'snow-monkey-editor' ) }
									value={ smeAnimation }
									options={ options }
									onChange={ ( value ) => {
										setAttributes( { smeAnimation: value } );

										const removeAnimationClassNames = classes.filter( ( element ) => `sme-animation-${ value }` !== element );
										setAttributes( {
											className: difference(
												classnames( className, { [ `sme-animation-${ value }` ]: !! value } ).split( ' ' ),
												removeAnimationClassNames,
											).join( ' ' ),
										} );
									} }
								/>
							</PanelBody>
						</InspectorControls>
					</>
				);
			};
		},
		'withSnowMonkeyEditorAnimationBlockEdit'
	)
);
