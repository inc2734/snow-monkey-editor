import { difference } from 'lodash';
import classnames from 'classnames';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { SelectControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import { classes } from './helper';
import customAttributes from './attributes.json';

const isShown = ( props ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'animation'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const isApplyToBlock = isApplyExtensionToBlock( props.name, 'animation' );
	if ( ! isApplyToBlock ) {
		return false;
	}

	const blockType = getBlockType( props.name );
	if ( ! blockType ) {
		return false;
	}

	if ( ! hasBlockSupport( blockType, 'customClassName', true ) ) {
		return false;
	}

	return true;
};

const Content = ( props ) => {
	const { attributes, setAttributes } = props;
	const { smeAnimation, smeAnimationDelay, smeAnimationDuration, className } =
		attributes;

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

	return (
		<>
			<SelectControl
				label={ __( 'Animation', 'snow-monkey-editor' ) }
				value={ smeAnimation || undefined }
				options={ options }
				onChange={ ( value ) => {
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
				} }
			/>

			<RangeControl
				label={ __( 'Delay', 'snow-monkey-editor' ) }
				value={ smeAnimationDelay || 0 }
				onChange={ ( value ) => {
					setAttributes( { smeAnimationDelay: value } );
				} }
				allowReset={ true }
				min={ 0 }
				max={ 5 }
				step={ 0.1 }
			/>

			<RangeControl
				label={ __( 'Duration', 'snow-monkey-editor' ) }
				value={ smeAnimationDuration || undefined }
				onChange={ ( value ) => {
					setAttributes( { smeAnimationDuration: value } );
				} }
				allowReset={ true }
				min={ 0 }
				max={ 5 }
				step={ 0.1 }
			/>
		</>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) => !! props.attributes?.smeAnimation,
	resetValue: ( props ) =>
		props.setAttributes( {
			smeAnimation: undefined,
			smeAnimationDelay: 0,
			smeAnimationDuration: undefined,
		} ),
	label: __( 'Animation', 'snow-monkey-editor' ),
	isShown,
	Content,
};

export const blockAttributes = ( blockType ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'animation'
	);
	if ( ! isApplyToUser ) {
		return blockType;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		blockType.name,
		'animation'
	);
	if ( ! isApplyToBlock ) {
		return blockType;
	}

	blockType.attributes = {
		...blockType.attributes,
		...customAttributes,
	};

	return blockType;
};
