import { registerFormatType } from '@wordpress/rich-text';

export const registerFormat = ( format ) => {
	if ( ! format ) {
		return;
	}

	const { name, settings } = format;
	registerFormatType( name, settings );
};
