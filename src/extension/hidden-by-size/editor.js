import { compact } from 'lodash';
import classnames from 'classnames/dedupe';

import {
	ToggleControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

const isShown = ( props ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'hidden-by-size'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		props.name,
		'hidden-by-size'
	);
	if ( ! isApplyToBlock ) {
		return false;
	}

	// if (
	// 	'undefined' === typeof props.attributes?.smeIsHiddenSm ||
	// 	'undefined' === typeof props.attributes?.smeIsHiddenMd ||
	// 	'undefined' === typeof props.attributes?.smeIsHiddenLg
	// ) {
	// 	return false;
	// }

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
	const { smeIsHiddenSm, smeIsHiddenMd, smeIsHiddenLg, className } =
		attributes;

	useEffect( () => {
		setAttributes( {
			className: classnames( className, {
				'sme-hidden-sm': smeIsHiddenSm,
				'sme-hidden-md': smeIsHiddenMd,
				'sme-hidden-lg-up': smeIsHiddenLg,
			} ),
		} );
	}, [ smeIsHiddenSm, smeIsHiddenMd, smeIsHiddenLg ] );

	return (
		<VStack spacing="16px">
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Hide on smartphone size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenSm }
				onChange={ ( value ) => {
					setAttributes( {
						smeIsHiddenSm: value,
					} );
				} }
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Hide on tablet size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenMd }
				onChange={ ( value ) => {
					setAttributes( {
						smeIsHiddenMd: value,
					} );
				} }
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Hide on PC size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenLg }
				onChange={ ( value ) => {
					setAttributes( {
						smeIsHiddenLg: value,
					} );
				} }
			/>
		</VStack>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) =>
		0 <
		compact( [
			props.attributes?.smeIsHiddenSm,
			props.attributes?.smeIsHiddenMd,
			props.attributes?.smeIsHiddenLg,
		] ).length,
	resetValue: ( props ) => {
		props.setAttributes( {
			smeIsHiddenSm: customAttributes.smeIsHiddenSm.default,
			smeIsHiddenMd: customAttributes.smeIsHiddenMd.default,
			smeIsHiddenLg: customAttributes.smeIsHiddenLg.default,
		} );
	},
	resetClassnames: () => {
		return {
			'sme-hidden-sm': customAttributes.smeIsHiddenSm.default,
			'sme-hidden-md': customAttributes.smeIsHiddenMd.default,
			'sme-hidden-lg-up': customAttributes.smeIsHiddenLg.default,
		};
	},
	label: __( 'Display setting (By window size)', 'snow-monkey-editor' ),
	isShown,
	Content,
};

export const blockAttributes = ( blockType ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'hidden-by-size'
	);
	if ( ! isApplyToUser ) {
		return blockType;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		blockType.name,
		'hidden-by-size'
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
