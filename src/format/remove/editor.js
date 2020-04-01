import { map } from 'lodash';

import { select } from '@wordpress/data';
import { removeFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyEditorButton } from '../component/snow-monkey-editor-button';

export const name = 'snow-monkey-editor/remove-fomatting';
const title = __( 'Remove formatting', 'snow-monkey-editor' );

export const settings = {
	title,
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
				title={ title }
				onClick={ onToggle }
				isActive={ isActive }
			/>
		);
	},
};
