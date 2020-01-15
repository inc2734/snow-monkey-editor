'use strict';

import {
	SnowMonkeyEditorButton,
} from '../component/snow-monkey-editor-button';

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
	last,
} from 'lodash';

import Popover from './popover';

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

		return (
			<Fragment>
				<SnowMonkeyEditorButton
					icon="editor-textcolor"
					title={ __( 'Font size', 'snow-monkey-editor' ) }
					onClick={ onToggle }
					isActive={ isActive }
				/>
				{ isActive && value.start < value.end && 0 < value.activeFormats.length && name === last( value.activeFormats ).type &&
					<Popover
						onChange={ onChangePopover }
					/>
				}
			</Fragment>
		);
	},
};
