import { getBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';

import customAttributes from './attributes.json';
import DateTimePicker from './date-time-picker';

const isShown = ( props ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'date-time'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const isApplyToBlock = isApplyExtensionToBlock( props.name, 'date-time' );
	if ( ! isApplyToBlock ) {
		return false;
	}

	const blockType = getBlockType( props.name );
	if ( ! blockType ) {
		return false;
	}

	return true;
};

const PublishContent = ( props ) => {
	const { attributes, setAttributes } = props;
	const { smeStartDateTime } = attributes;

	const onChangeStartDateTime = ( value ) =>
		setAttributes( { smeStartDateTime: value } );

	const onResetStartDateTime = () =>
		setAttributes( { smeStartDateTime: undefined } );

	return (
		<DateTimePicker
			currentDate={ smeStartDateTime }
			onChange={ onChangeStartDateTime }
			onReset={ onResetStartDateTime }
		/>
	);
};

const UnpublishContent = ( props ) => {
	const { attributes, setAttributes } = props;
	const { smeEndDateTime } = attributes;

	const onChangeEndDateTime = ( value ) =>
		setAttributes( { smeEndDateTime: value } );

	const onResetEndDateTime = () =>
		setAttributes( { smeEndDateTime: undefined } );

	return (
		<DateTimePicker
			currentDate={ smeEndDateTime }
			onChange={ onChangeEndDateTime }
			onReset={ onResetEndDateTime }
		/>
	);
};

export const publishSettings = {
	resetAll: {},
	hasValue: ( props ) => !! props.attributes?.smeStartDateTime,
	resetValue: ( props ) =>
		props.setAttributes( { smeStartDateTime: undefined } ),
	label: __( 'Publish setting', 'snow-monkey-editor' ),
	isShown,
	Content: PublishContent,
};

export const unpublishSettings = {
	resetAll: {},
	hasValue: ( props ) => !! props.attributes?.smeEndDateTime,
	resetValue: ( props ) =>
		props.setAttributes( { smeEndDateTime: undefined } ),
	label: __( 'Unpublish setting', 'snow-monkey-editor' ),
	isShown,
	Content: UnpublishContent,
};

export const blockAttributes = ( blockType ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'date-time'
	);
	if ( ! isApplyToUser ) {
		return blockType;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		blockType.name,
		'date-time'
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
