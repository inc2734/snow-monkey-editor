'use strict';

import { Fill, ToolbarButton } from '@wordpress/components';
import { displayShortcut } from '@wordpress/keycodes';

export function SnowMonkeyEditorButton( { name, shortcutType, shortcutCharacter, ...props } ) {
	let shortcut;
	let fillName = 'SnowMonkeyEditorButtonControls';

	if ( name ) {
		fillName += `.${ name }`;
	}

	if ( shortcutType && shortcutCharacter ) {
		shortcut = displayShortcut[ shortcutType ]( shortcutCharacter );
	}

	return (
		<Fill name={ fillName }>
			<ToolbarButton
				{ ...props }
				shortcut={ shortcut }
			/>
		</Fill>
	);
}
