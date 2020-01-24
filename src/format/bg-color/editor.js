'use strict';

import {
	last,
} from 'lodash';

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

export const name = 'snow-monkey-editor/bg-color';

export const settings = {
	title: __( 'Background color', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-bg-color',
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

		const currentNode = getPopoverCurrentNode();

		return (
			<Fragment>
				<SnowMonkeyEditorButton
					icon="buddicons-topics"
					title={ __( 'Background color', 'snow-monkey-editor' ) }
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
