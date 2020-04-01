import { registerBlockStyle } from '@wordpress/blocks';

export const registerStyle = ( style ) => {
	if ( ! style ) {
		return;
	}

	const { name, settings } = style;
	registerBlockStyle( name, settings );
};
