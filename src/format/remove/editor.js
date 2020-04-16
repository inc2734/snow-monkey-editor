import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { removeFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyEditorButton } from '../component/snow-monkey-editor-button';

export const name = 'snow-monkey-editor/remove-fomatting';
const title = __( 'Remove formatting', 'snow-monkey-editor' );

const Edit = ( { isActive, value, onChange } ) => {
	const formatTypes = useSelect(
		( select ) => select( 'core/rich-text' ).getFormatTypes(),
		[]
	);

	const onToggle = useCallback( () => {
		if ( 0 < formatTypes.length ) {
			let newValue = value;
			formatTypes.forEach( ( formatType ) => {
				newValue = removeFormat( newValue, formatType.name );
			} );
			onChange( { ...newValue } );
		}
	}, [ value, formatTypes ] );

	return (
		<SnowMonkeyEditorButton
			icon="editor-removeformatting"
			title={ title }
			onClick={ onToggle }
			isActive={ isActive }
		/>
	);
};

export const settings = {
	title,
	tagName: 'span',
	className: 'sme-remove-fomatting',
	edit: Edit,
};
