'use select';

import classnames from 'classnames';

import {
	getBlockDefaultClassName,
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

				const sizes = [
					{
						className: 'sme-hidden-sm',
						attribute: smeIsHiddenSm,
					},
					{
						className: 'sme-hidden-md',
						attribute: smeIsHiddenMd,
					},
					{
						className: 'sme-hidden-lg-up',
						attribute: smeIsHiddenLg,
					}
				];

				const arrayClassName = className ? className.split( ' ' ) : [];
				const allClassName = [ ...arrayClassName, ...sizes.map( ( e ) => e.className ) ];

				const extraClassName = sizes.map( ( element ) => {
					if ( true === element.attribute ) {
						return element.className;
					}
				} ).filter( ( element ) => element );

				const newClassName = allClassName.map( ( element ) => {
					if ( ! sizes.map( ( e ) => e.className ).includes( element ) || extraClassName.includes( element ) ) {
						return element;
					}
				} ).filter( ( element, index, self ) => element && self.indexOf( element ) === index );

				if ( hasBlockSupport( blockType, 'customClassName', true ) ) {
					props.attributes.className = classnames( newClassName );
				}

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
