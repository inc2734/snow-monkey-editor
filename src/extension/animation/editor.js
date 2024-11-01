import classnames from 'classnames/dedupe';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import {
	SelectControl,
	RangeControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

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

	useEffect( () => {
		const newClassNameMap = {};
		options.forEach( ( value ) => {
			newClassNameMap[ `sme-animation-${ value.value }` ] = false;
		} );
		if ( !! smeAnimation ) {
			newClassNameMap[ `sme-animation-${ smeAnimation }` ] = true;
		}
		setAttributes( {
			className: classnames( className, {
				...newClassNameMap,
			} ),
		} );
	}, [ smeAnimation ] );

	return (
		<VStack spacing="16px">
			<SelectControl
				__nextHasNoMarginBottom
				label={ __( 'Animation', 'snow-monkey-editor' ) }
				value={ smeAnimation || undefined }
				options={ options }
				onChange={ ( value ) => {
					setAttributes( { smeAnimation: value } );

					if ( ! value ) {
						setAttributes( {
							smeAnimationDelay:
								customAttributes.smeAnimationDelay.default,
						} );
					}
				} }
			/>

			<RangeControl
				__nextHasNoMarginBottom
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
				__nextHasNoMarginBottom
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
		</VStack>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) => !! props.attributes?.smeAnimation,
	resetValue: ( props ) => {
		props.setAttributes( {
			smeAnimation: customAttributes.smeAnimation.default,
			smeAnimationDelay: customAttributes.smeAnimationDelay.default,
			smeAnimationDuration: customAttributes.smeAnimationDuration.default,
		} );
	},
	resetClassnames: ( props ) => {
		const newClassNameMap = {};
		if ( null != props.attributes?.smeAnimation ) {
			newClassNameMap[
				`sme-animation-${ props.attributes.smeAnimation }`
			] = false;
		}
		return newClassNameMap;
	},
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
