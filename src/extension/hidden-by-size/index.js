'use select';

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
				} = props;

				const {
					smeIsHiddenSm,
					smeIsHiddenMd,
					smeIsHiddenLg,
					className,
				} = attributes;

				props.attributes.className = ( () => {
					let extraClassName = className ? className.split( ' ' ) : [];

					if ( true === smeIsHiddenSm && ! extraClassName.includes( 'sme-hidden-sm' ) ) {
						extraClassName.push( 'sme-hidden-sm' );
					} else if ( false === smeIsHiddenSm ) {
						extraClassName = extraClassName.filter( ( value ) => value !== 'sme-hidden-sm' );
					}

					if ( true === smeIsHiddenMd && ! extraClassName.includes( 'sme-hidden-md' ) ) {
						extraClassName.push( 'sme-hidden-md' );
					} else if ( false === smeIsHiddenMd ) {
						extraClassName = extraClassName.filter( ( value ) => value !== 'sme-hidden-md' );
					}

					if ( true === smeIsHiddenLg && ! extraClassName.includes( 'sme-hidden-lg-up' ) ) {
						extraClassName.push( 'sme-hidden-lg-up' );
					} else if ( false === smeIsHiddenLg ) {
						extraClassName = extraClassName.filter( ( value ) => value !== 'sme-hidden-lg-up' );
					}

					return extraClassName.join( ' ' );
				} )();

				return (
					<>
						<BlockEdit { ...props } />
						<InspectorControls>
							<PanelBody title={ __( 'Display setting (By the window size)', 'snow-monkey-editor' ) } initialOpen={ false } icon={ icon }>
								<ToggleControl
									label={ __( 'Hide on smartphone size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenSm }
									onChange={ ( value ) => setAttributes( { smeIsHiddenSm: value } ) }
								/>

								<ToggleControl
									label={ __( 'Hide on tablet size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenMd }
									onChange={ ( value ) => setAttributes( { smeIsHiddenMd: value } ) }
								/>

								<ToggleControl
									label={ __( 'Hide on PC size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenLg }
									onChange={ ( value ) => setAttributes( { smeIsHiddenLg: value } ) }
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
