import { Fill, ToolbarButton } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { displayShortcut } from '@wordpress/keycodes';

const FillToolbarButton = memo(
	( { shortcut, fillName, ...props } ) => {
		return (
			<Fill name={ fillName }>
				<ToolbarButton { ...props } shortcut={ shortcut } />
			</Fill>
		);
	},
	( p, n ) => {
		return p.title === n.title && p.key === n.key;
	}
);

export function SnowMonkeyEditorButton( {
	name,
	shortcutType,
	shortcutCharacter,
	...props
} ) {
	let shortcut;
	let fillName = 'SnowMonkeyEditorButtonControls';

	if ( name ) {
		fillName += `.${ name }`;
	}

	if ( shortcutType && shortcutCharacter ) {
		shortcut = displayShortcut[ shortcutType ]( shortcutCharacter );
	}

	return (
		<FillToolbarButton
			{ ...props }
			fillName={ fillName }
			shortcut={ shortcut }
		/>
	);
}
