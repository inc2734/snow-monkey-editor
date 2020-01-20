'use strict';

import {
	last,
} from 'lodash';

import hexToRgba from 'hex-to-rgba';

import {
	Fragment,
} from '@wordpress/element';

import {
	toggleFormat,
	applyFormat,
	removeFormat,
} from '@wordpress/rich-text';

import {
	__,
} from '@wordpress/i18n';

import {
	SnowMonkeyEditorButton,
} from '../component/snow-monkey-editor-button';

import Popover from './popover';
import getPopoverCurrentNode from '../helper/get-popover-current-node';

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

		const currentNode = getPopoverCurrentNode();

		return (
			<Fragment>
				<SnowMonkeyEditorButton
					icon="admin-customizer"
					title={ __( 'Highlighter', 'snow-monkey-editor' ) }
					onClick={ onToggle }
					isActive={ isActive }
				/>
				{ isActive && !! currentNode && 0 < value.activeFormats.length && name === last( value.activeFormats ).type &&
					<Popover
						currentNode={ currentNode }
						onChange={ onChangePopover }
					/>
				}
			</Fragment>
		);
	},
};
