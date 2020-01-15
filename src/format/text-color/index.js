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

export const name = 'snow-monkey-editor/text-color';

export const settings = {
	title: __( 'Text color', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-text-color',
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
				attributes.style = `color: ${ color }`;
				onChange( applyFormat( value, { type: name, attributes } ) );
			} else {
				onChange( removeFormat( value, name ) );
			}
		};

		return (
			<Fragment>
				<SnowMonkeyEditorButton
					icon="edit"
					title={ __( 'Text color', 'snow-monkey-editor' ) }
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
