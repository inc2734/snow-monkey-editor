'use select';

import {
	compact,
} from 'lodash';

import classnames from 'classnames/dedupe';

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
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	useSelect,
} from '@wordpress/data';

import {
	addFilter,
} from '@wordpress/hooks';

import {
	__,
} from '@wordpress/i18n';

import {
	icon,
} from '../../helper/icon';

import {
	isApplyExtensionToBlock,
	isApplyExtensionToUser,
} from '../helper';

import customAttributes from './attributes';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/hidden-by-size/attributes',
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

				const currentUser = useSelect( ( select ) => {
					return select( 'core' ).getCurrentUser();
				}, [] );

				if ( 0 < Object.keys( currentUser ).length ) {
					const isApplyToUser = isApplyExtensionToUser( currentUser, 'hidden-by-size' );
					if ( ! isApplyToUser ) {
						return <BlockEdit { ...props } />;
					}
				}

				const isApplyToBlock = isApplyExtensionToBlock( name, 'hidden-by-size' );
				if ( ! isApplyToBlock ) {
					return <BlockEdit { ...props } />;
				}

				if ( 'undefined' === typeof smeIsHiddenSm || 'undefined' === typeof smeIsHiddenMd || 'undefined' === typeof smeIsHiddenLg ) {
					return <BlockEdit { ...props } />;
				}

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				if ( ! hasBlockSupport( blockType, 'customClassName', true ) ) {
					return <BlockEdit { ...props } />;
				}

				return (
					<>
						<BlockEdit { ...props } />

						<InspectorControls>
							<PanelBody
								title={ __( 'Display setting (By window size)', 'snow-monkey-editor' ) }
								initialOpen={ false }
								icon={ icon }
								className={ 0 < compact( [ smeIsHiddenSm, smeIsHiddenMd, smeIsHiddenLg ] ).length ? 'sme-extension-panel sme-extension-panel--enabled' : 'sme-extension-panel' }
							>
								<ToggleControl
									label={ __( 'Hide on smartphone size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenSm }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenSm: value } );
										setAttributes( { className: classnames( className, { 'sme-hidden-sm': value } ) } );
									} }
								/>

								<ToggleControl
									label={ __( 'Hide on tablet size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenMd }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenMd: value } );
										setAttributes( { className: classnames( className, { 'sme-hidden-md': value } ) } );
									} }
								/>

								<ToggleControl
									label={ __( 'Hide on PC size', 'snow-monkey-editor' ) }
									checked={ smeIsHiddenLg }
									onChange={ ( value ) => {
										setAttributes( { smeIsHiddenLg: value } );
										setAttributes( { className: classnames( className, { 'sme-hidden-lg-up': value } ) } );
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
