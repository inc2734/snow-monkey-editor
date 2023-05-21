import { compact } from 'lodash';
import classnames from 'classnames/dedupe';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
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

	const onChangeIsHiddenSm = ( value ) => {
		setAttributes( {
			smeIsHiddenSm: value,
			className: classnames( className, {
				'sme-hidden-sm': value,
			} ),
		} );
	};

	const onChangeIsHiddenMd = ( value ) => {
		setAttributes( {
			smeIsHiddenMd: value,
			className: classnames( className, {
				'sme-hidden-md': value,
			} ),
		} );
	};

	const onChangeIsHiddenLg = ( value ) => {
		setAttributes( {
			smeIsHiddenLg: value,
			className: classnames( className, {
				'sme-hidden-lg-up': value,
			} ),
		} );
	};

	return (
		<>
			<ToggleControl
				label={ __( 'Hide on smartphone size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenSm }
				onChange={ onChangeIsHiddenSm }
			/>

			<ToggleControl
				label={ __( 'Hide on tablet size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenMd }
				onChange={ onChangeIsHiddenMd }
			/>

			<ToggleControl
				label={ __( 'Hide on PC size', 'snow-monkey-editor' ) }
				checked={ smeIsHiddenLg }
				onChange={ onChangeIsHiddenLg }
			/>
		</>
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
	resetValue: ( props ) =>
		props.setAttributes( {
			smeIsHiddenSm: undefined,
			smeIsHiddenMd: undefined,
			smeIsHiddenLg: undefined,
		} ),
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
