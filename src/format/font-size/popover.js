import { find } from 'lodash';

import { URLPopover } from '@wordpress/block-editor';
import { FontSizePicker } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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

	const fontSizes = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().fontSizes
	);

	const numbered = ( value ) => {
		if ( 'number' === typeof value ) {
			return value;
		}

		if ( 'string' !== typeof value ) {
			return undefined;
		}

		const matches = value.match( /^([\d]*?)px$/i );
		if ( ! matches ) {
			return undefined;
		}

		return Number( matches[ 1 ] );
	};

	const onChangeSetting = ( value ) => {
		const matched = find( fontSizes, [ 'size', value ] );
		const key = 'undefined' !== typeof matched ? matched.slug : 'custom';

		const newSetting = {
			size: value,
			class: `has-${ key }-font-size`,
		};
		setSetting( newSetting );
		onChange( newSetting );
	};

	return (
		<URLPopover
			anchorRect={ anchorRect }
			className="sme-popover components-inline-color-popover"
			{ ...props }
		>
			<FontSizePicker
				fontSizes={ fontSizes }
				disableCustomFontSizes={ true }
				value={
					numbered( !! setting && setting.size ) ||
					numbered( currentSetting )
				}
				onChange={ onChangeSetting }
			/>
		</URLPopover>
	);
}
