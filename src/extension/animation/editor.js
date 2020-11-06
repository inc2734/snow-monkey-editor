'use select';

import { difference } from 'lodash';
import classnames from 'classnames';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';
import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import { classes } from './helper';
import customAttributes from './attributes.json';

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

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const { smeAnimation, className } = attributes;

		const currentUser = useSelect( ( select ) => {
			return select( 'core' ).getCurrentUser();
		}, [] );

		if ( 0 < Object.keys( currentUser ).length ) {
			const isApplyToUser = isApplyExtensionToUser(
				currentUser,
				'animation'
			);
			if ( ! isApplyToUser ) {
				return <BlockEdit { ...props } />;
			}
		}

		const isApplyToBlock = isApplyExtensionToBlock( name, 'animation' );
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

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
			{
				label: __( 'bounce-in', 'snow-monkey-editor' ),
				value: 'bounce-in',
			},
			{
				label: __( 'bounce-down', 'snow-monkey-editor' ),
				value: 'bounce-down',
			},
			{
				label: __( 'fade-in', 'snow-monkey-editor' ),
				value: 'fade-in',
			},
			{
				label: __( 'fade-in-up', 'snow-monkey-editor' ),
				value: 'fade-in-up',
			},
			{
				label: __( 'fade-in-down', 'snow-monkey-editor' ),
				value: 'fade-in-down',
			},
		];

		const panelClassName = !! smeAnimation
			? 'sme-extension-panel sme-extension-panel--enabled'
			: 'sme-extension-panel';

		const onChangeAnimation = ( value ) => {
			setAttributes( { smeAnimation: value } );

			const removeAnimationClassNames = classes.filter(
				( element ) => `sme-animation-${ value }` !== element
			);

			setAttributes( {
				className: difference(
					classnames( className, {
						[ `sme-animation-${ value }` ]: !! value,
					} ).split( ' ' ),
					removeAnimationClassNames
				).join( ' ' ),
			} );
		};

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __( 'Animation', 'snow-monkey-editor' ) }
						initialOpen={ false }
						icon={ icon }
						className={ panelClassName }
					>
						<SelectControl
							label={ __( 'Animation', 'snow-monkey-editor' ) }
							value={ smeAnimation || undefined }
							options={ options }
							onChange={ onChangeAnimation }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSnowMonkeyEditorAnimationBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/animation/block-edit',
	addBlockControl
);
