import rgb2hex from 'rgb2hex';
import hexToRgba from 'hex-to-rgba';

import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyEditorButton } from '../component/snow-monkey-editor-button';
import hexLong2Short from '../helper/hex-long2short';
import Popover from './popover';

export const name = 'snow-monkey-editor/highlighter';
const title = __( 'Highlighter', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, isActive, onChange } = props;
	const [ addingSetting, setAddingSetting ] = useState( false );

	const currentSetting = ( () => {
		const activeFormat = getActiveFormat( value, name );
		if ( ! activeFormat || ! activeFormat.attributes ) {
			return;
		}

		const currentStyle = activeFormat.attributes.style;
		if ( ! currentStyle ) {
			return;
		}

		const hex = currentStyle.match( /(#[0-9A-F]{3,6}) /i );
		if ( hex ) {
			return hex;
		}

		const rgb = currentStyle.match( /,\s*?(rgba?\([^)]+\)) /i );
		if ( rgb ) {
			return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
		}
	} )();

	const icon = (
		<>
			<Icon icon="admin-customizer" />
			{ isActive && (
				<span
					className="format-library-text-color-button__indicator"
					style={ {
						backgroundColor: currentSetting,
					} }
				/>
			) }
		</>
	);

	const onClickButton = () => setAddingSetting( true );

	const onChangePopover = ( color ) => {
		const attributes = {};
		if ( color ) {
			const lineColor = hexToRgba( color, 0.5 );
			attributes.style = `background-image: linear-gradient(transparent 60%, ${ lineColor } 60%)`;
			onChange( applyFormat( value, { type: name, attributes } ) );
		} else {
			onChange( removeFormat( value, name ) );
		}
	};

	const onClosePopover = () => setAddingSetting( false );

	return (
		<>
			<SnowMonkeyEditorButton
				key={
					isActive ? 'sme-highlighter' : 'sme-highlighter-not-active'
				}
				name={ isActive ? 'sme-highlighter' : undefined }
				title={ title }
				className="format-library-text-color-button"
				onClick={ onClickButton }
				icon={ icon }
			/>
			{ addingSetting && (
				<Popover
					addingSetting={ addingSetting }
					currentSetting={ currentSetting }
					isActive={ isActive }
					onChange={ onChangePopover }
					onClose={ onClosePopover }
				/>
			) }
		</>
	);
};

export const settings = {
	title,
	tagName: 'span',
	className: 'sme-highlighter',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
