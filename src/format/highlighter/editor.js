'use strict';

import rgb2hex from 'rgb2hex';
import hexToRgba from 'hex-to-rgba';

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
import hexLong2Short from '../helper/hex-long2short';

export const name = 'snow-monkey-editor/highlighter';

export const settings = {
	title: __( 'Highlighter', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-highlighter',
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
				const lineColor = hexToRgba( color, 0.5 );
				attributes.style = `background-image: linear-gradient(transparent 60%, ${ lineColor } 60%)`;
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

			const hex = currentStyle.match( /(#[0-9A-F]{3,6}) /i );
			if ( hex ) {
				return hex;
			}

			const rgb = currentStyle.match( /,\s*?(rgba?\([^)]+\)) /i );
			if ( rgb ) {
				return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
			}
		};

		return (
			<>
				<SnowMonkeyEditorButton
					icon="admin-customizer"
					title={ __( 'Highlighter', 'snow-monkey-editor' ) }
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
