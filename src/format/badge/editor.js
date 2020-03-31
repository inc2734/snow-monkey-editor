'use strict';

import {
	toggleFormat,
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import {
	__,
} from '@wordpress/i18n';

import {
	SnowMonkeyEditorButton,
} from '../component/snow-monkey-editor-button';

import Popover from './popover';
import getPopoverCurrentNode from '../helper/get-popover-current-node';
import isPopoverOpen from '../helper/is-popover-open';

export const name = 'snow-monkey-editor/badge';

export const settings = {
	title: __( 'Badge', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-badge',
	attributes: {
		style: 'style',
	},
	edit: ( props ) => {
		const { value, isActive, onChange } = props;

		const onToggle = () => {
			onChange( toggleFormat( value, { type: name } ) );
		};

		const onChangePopover = ( color ) => {
			const attributes = {};
			if ( color ) {
				attributes.style = `background-color: ${ color }`;
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

			return currentStyle.replace( new RegExp( `^background-color:\\s*` ), '' );
		};

		return (
			<>
				<SnowMonkeyEditorButton
					icon="tag"
					title={ __( 'Badge', 'snow-monkey-editor' ) }
					onClick={ onToggle }
					isActive={ isActive }
				/>
				{ isPopoverOpen( name, value ) &&
					<Popover
						currentNode={ getPopoverCurrentNode() }
						currentSetting={ getCurrentSetting() }
						onChange={ onChangePopover }
					/>
				}
			</>
		);
	},
};
