import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyEditorButton } from '../component/snow-monkey-editor-button';
import Popover from './popover';

export const name = 'snow-monkey-editor/bg-color';
const title = __( 'Background color', 'snow-monkey-editor' );

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

		return currentStyle.replace(
			new RegExp( `^background-color:\\s*` ),
			''
		);
	} )();

	const icon = useMemo(
		() => (
			<>
				<Icon icon="buddicons-topics" />
				{ isActive && (
					<span
						className="format-library-text-color-button__indicator"
						style={ {
							backgroundColor: currentSetting,
						} }
					/>
				) }
			</>
		),
		[ isActive, currentSetting ]
	);

	const onClickButton = useCallback( () => setAddingSetting( true ), [] );

	const onChangePopover = ( color ) => {
		const attributes = {};
		if ( color ) {
			attributes.style = `background-color: ${ color }`;
			onChange( applyFormat( value, { type: name, attributes } ) );
		} else {
			onChange( removeFormat( value, name ) );
		}
	};

	const onClosePopover = () => setAddingSetting( false );

	return (
		<>
			<SnowMonkeyEditorButton
				key={ isActive ? 'sme-bg-color' : 'sme-bg-color-not-active' }
				name={ isActive ? 'sme-bg-color' : undefined }
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
	className: 'sme-bg-color',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
