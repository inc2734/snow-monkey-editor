import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { removeFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/remove-fomatting';
const title = __( 'Remove formatting', 'snow-monkey-editor' );

const Edit = ( { value, onChange } ) => {
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
		<SnowMonkeyToolbarButton
			icon="editor-removeformatting"
			title={ title }
			onClick={ onToggle }
		/>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-remove-fomatting',
	edit: Edit,
};
