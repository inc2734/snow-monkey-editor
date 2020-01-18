'use select';

import {
	uniq,
} from 'lodash';

import {
	hasBlockSupport,
	getBlockType,
} from '@wordpress/blocks';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	ToggleControl,
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
} from '../../js/helper/icon';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/hidden-by-size/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			smeIsHiddenSm: {
				type: 'boolean',
				default: false,
			},
			smeIsHiddenMd: {
				type: 'boolean',
				default: false,
			},
			smeIsHiddenLg: {
				type: 'boolean',
				default: false,
			},
		};
		return settings;
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/hidden-by-size/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					setAttributes,
					name,
				} = props;

				const {
					smeIsHiddenSm,
					smeIsHiddenMd,
					smeIsHiddenLg,
					className,
				} = attributes;

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				const getUpdatedClassName = ( addedClassName, enable ) => {
					const arrayClassName = className ? className.split( ' ' ) : [];
					const newClassName = true === enable ?
						[ ...arrayClassName, addedClassName ] :
						arrayClassName.filter( ( element ) => addedClassName !== element );

					return uniq( newClassName ).join( ' ' );
				};

				return (
					<>
						<BlockEdit { ...props } />

						<InspectorControls>
							<PanelBody title={ __( 'Display setting (By the window size)', 'snow-monkey-editor' ) } initialOpen={ false } icon={ icon }>
								<ToggleControl
									label={ __( 'Hide on smartphone size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenSm }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenSm: value } );
										if ( hasBlockSupport( blockType, 'customClassName', true ) ) {
											setAttributes( { className: getUpdatedClassName( 'sme-hidden-sm', value ) } );
										}
									} }
								/>

								<ToggleControl
									label={ __( 'Hide on tablet size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenMd }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenMd: value } );
										if ( hasBlockSupport( blockType, 'customClassName', true ) ) {
											setAttributes( { className: getUpdatedClassName( 'sme-hidden-md', value ) } );
										}
									} }
								/>

								<ToggleControl
									label={ __( 'Hide on PC size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenLg }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenLg: value } );
										if ( hasBlockSupport( blockType, 'customClassName', true ) ) {
											setAttributes( { className: getUpdatedClassName( 'sme-hidden-lg-up', value ) } );
										}
									} }
								/>
							</PanelBody>
						</InspectorControls>
					</>
				);
			};
		},
		'withSnowMonkeyEditorHiddenBySizeBlockEdit'
	)
);
