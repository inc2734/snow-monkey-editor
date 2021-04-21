import { difference } from 'lodash';
import classnames from 'classnames';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';
import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import { classes } from './helper';
import customAttributes from './attributes.json';

const addBlockAttributes = ( settings ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor.currentUser,
		'animation'
	);
	if ( ! isApplyToUser ) {
		return settings;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		settings.name,
		'animation'
	);
	if ( ! isApplyToBlock ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		...customAttributes,
	};
	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/animation/attributes',
	addBlockAttributes
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const {
			smeAnimation,
			smeAnimationDelay,
			smeAnimationDuration,
			className,
		} = attributes;

		const isApplyToUser = isApplyExtensionToUser(
			snowmonkeyeditor.currentUser,
			'animation'
		);
		if ( ! isApplyToUser ) {
			return <BlockEdit { ...props } />;
		}

		const isApplyToBlock = isApplyExtensionToBlock( name, 'animation' );
		if ( ! isApplyToBlock ) {
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
			{ label: '', value: undefined },
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

			if ( ! value ) {
				setAttributes( { smeAnimationDelay: undefined } );
			}

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

		const onChangeAnimationDelay = ( value ) => {
			setAttributes( { smeAnimationDelay: value } );
		};

		const onChangeAnimationDuration = ( value ) => {
			setAttributes( { smeAnimationDuration: value } );
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

						<RangeControl
							label={ __( 'Delay', 'snow-monkey-editor' ) }
							value={ smeAnimationDelay || 0 }
							onChange={ onChangeAnimationDelay }
							allowReset={ true }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
						/>

						<RangeControl
							label={ __( 'Duration', 'snow-monkey-editor' ) }
							value={ smeAnimationDuration || undefined }
							onChange={ onChangeAnimationDuration }
							allowReset={ true }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
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
