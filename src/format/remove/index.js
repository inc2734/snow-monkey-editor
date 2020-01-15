'use strict';

import {
	map,
} from 'lodash';

import {
	SnowMonkeyEditorButton,
} from '../component/snow-monkey-editor-button';

import {
	select,
} from '@wordpress/data';

import {
	removeFormat,
} from '@wordpress/rich-text';

import {
	__,
} from '@wordpress/i18n';

export const name = 'snow-monkey-editor/remove-fomatting';

export const settings = {
	title: __( 'Remove formatting', 'snow-monkey-editor' ),
	tagName: 'span',
	className: 'sme-remove-fomatting',
	edit( { isActive, value, onChange } ) {
		const onToggle = () => {
			const formatTypes = select( 'core/rich-text' ).getFormatTypes();
			if ( 0 < formatTypes.length ) {
				let newValue = value;
				map( formatTypes, ( activeFormat ) => {
					newValue = removeFormat( newValue, activeFormat.name );
				} );
				onChange( { ...newValue } );
			}
		};

		return (
			<SnowMonkeyEditorButton
				icon="editor-removeformatting"
				title={ __( 'Remove formatting', 'snow-monkey-editor' ) }
				onClick={ onToggle }
				isActive={ isActive }
			/>
		);
	},
};
