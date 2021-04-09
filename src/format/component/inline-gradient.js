import { get } from 'lodash';
import rgb2hex from 'rgb2hex';
import hexToRgba from 'hex-to-rgba';

import { ColorPalette, URLPopover } from '@wordpress/block-editor';
import { withSpokenMessages } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { useAnchorRef } from './use-anchor-ref';
import hexLong2Short from '../helper/hex-long2short';

export function getActiveColor( formatName, formatValue ) {
	const activeColorFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeColorFormat ) {
		return;
	}

	const styleColor = activeColorFormat.attributes.style;
	if ( ! styleColor ) {
		return;
	}

	const hex = styleColor.match( /(#[0-9A-F]{3,6}) /i );
	if ( hex ) {
		return hex;
	}

	const rgb = styleColor.match( /,\s*?(rgba?\([^)]+\)) /i );
	if ( rgb ) {
		return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
	}
}

const ColorPicker = ( { name, value, onChange, onClose } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const onColorChange = useCallback(
		( color ) => {
			if ( color ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `background-image: linear-gradient(transparent 60%, ${ hexToRgba(
								color,
								0.5
							) } 60%)`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
				onClose();
			}
		},
		[ colors, onChange ]
	);

	const activeColor = useMemo( () => getActiveColor( name, value, colors ), [
		name,
		value,
		colors,
	] );

	return <ColorPalette value={ activeColor } onChange={ onColorChange } />;
};

const InlineColorUI = ( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	settings,
} ) => {
	const anchorRef = useAnchorRef( { ref: contentRef, value, settings } );
	return (
		<URLPopover
			value={ value }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
			anchorRef={ anchorRef }
		>
			<ColorPicker
				name={ name }
				value={ value }
				onChange={ onChange }
				onClose={ onClose }
			/>
		</URLPopover>
	);
};

export default withSpokenMessages( InlineColorUI );
