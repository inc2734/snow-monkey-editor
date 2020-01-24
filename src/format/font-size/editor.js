'use strict';

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
import isPopoverOpen from '../helper/is-popover-open';

export const name = 'snow-monkey-editor/font-size';

export const settings = {
	title: __( 'Font size', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-font-size',
	attributes: {
		style: 'style',
		className: 'class',
	},
	edit: ( props ) => {
		const { value, isActive, onChange } = props;

		const onToggle = () => {
			onChange( toggleFormat( value, { type: name } ) );
		};

		const onChangePopover = ( fontSize ) => {
			const attributes = {};
			if ( fontSize ) {
				attributes.style = `font-size: ${ fontSize.size }px`;
				attributes.className = fontSize.class;
				onChange( applyFormat( value, { type: name, attributes } ) );
			} else {
				onChange( removeFormat( value, name ) );
			}
		};

		const currentNode = getPopoverCurrentNode();

		return (
			<>
				<SnowMonkeyEditorButton
					icon="editor-textcolor"
					title={ __( 'Font size', 'snow-monkey-editor' ) }
					onClick={ onToggle }
					isActive={ isActive }
				/>
				{ isPopoverOpen( name, value ) &&
					<Popover
						currentNode={ currentNode }
						onChange={ onChangePopover }
					/>
				}
			</>
		);
	},
};
