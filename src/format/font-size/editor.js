'use strict';

import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';

import {
	__,
} from '@wordpress/i18n';

import {
	SnowMonkeyEditorButton,
} from '../component/snow-monkey-editor-button';

import Popover from './popover';

export const name = 'snow-monkey-editor/font-size';
const title = __( 'Font size', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, isActive, onChange } = props;
	const [ addingSetting, setAddingSetting ] = useState( false );

	const onChangePopover = ( fontSize ) => {
		const attributes = {};
		if ( fontSize && 'undefined' !== typeof fontSize.size ) {
			attributes.style = `font-size: ${ fontSize.size }px`;
			attributes.className = fontSize.class;
			onChange( applyFormat( value, { type: name, attributes } ) );
		} else {
			onChange( removeFormat( value, name ) );
		}
	};

	const getCurrentSetting = () => {
		const activeFormat = getActiveFormat( value, name );
		if ( ! activeFormat || ! activeFormat.attributes ) {
			return;
		}

		const currentStyle = activeFormat.attributes.style;
		if ( ! currentStyle ) {
			return;
		}

		return currentStyle.replace( new RegExp( `^font-size:\\s*` ), '' );
	};

	return (
		<>
			<SnowMonkeyEditorButton
				key={ isActive ? 'sme-font-size' : 'sme-font-size-not-active' }
				name={ isActive ? 'sme-font-size' : undefined }
				title={ title }
				className="format-library-text-color-button"
				onClick={ () => setAddingSetting( true ) }
				icon={
					<>
						<Icon icon="editor-textcolor" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator"
								style={ { backgroundColor: '#cd162c' } }
							/>
						) }
					</>
				}
			/>
			{ addingSetting &&
				<Popover
					addingSetting={ addingSetting }
					currentSetting={ getCurrentSetting() }
					isActive={ isActive }
					onChange={ onChangePopover }
					onClose={ () => setAddingSetting( false ) }
				/>
			}
		</>
	);
};

export const settings = {
	title,
	tagName: 'span',
	className: 'sme-font-size',
	attributes: {
		style: 'style',
		className: 'class',
	},
	edit: Edit,
};
