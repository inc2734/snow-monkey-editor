import { ColorPalette, URLPopover } from '@wordpress/block-editor';
import { useState, useMemo } from '@wordpress/element';

import getPopoverAnchorRect from '../helper/get-popover-anchor-rect';

export default function( props ) {
	const { addingSetting, currentSetting, onChange } = props;
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = useMemo(
		() => getPopoverAnchorRect( addingSetting ),
		[]
	);

	if ( ! anchorRect ) {
		return null;
	}

	const onChangeSetting = ( value ) => {
		const hex = ( value && value.hex ) || value;
		setSetting( hex );
		onChange( hex );
	};

	return (
		<URLPopover
			anchorRect={ anchorRect }
			className="sme-popover components-inline-color-popover"
			{ ...props }
		>
			<ColorPalette
				value={ setting || currentSetting }
				onChange={ onChangeSetting }
			/>
		</URLPopover>
	);
}
