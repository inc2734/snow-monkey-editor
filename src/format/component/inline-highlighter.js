import rgb2hex from 'rgb2hex';

import {
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';
import { Popover } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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

const ColorPicker = ( { name, value, onChange } ) => {
	const multipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradients();

	const activeColor = useMemo(
		() =>
			getActiveColor(
				name,
				value,
				multipleOriginColorsAndGradients?.colors
			),
		[ name, value, multipleOriginColorsAndGradients?.colors ]
	);

	return (
		<ColorGradientControl
			label={ __( 'Color', 'snow-monkey-editor' ) }
			colorValue={ activeColor }
			onColorChange={ onChange }
			{ ...multipleOriginColorsAndGradients }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
};

const InlineColorUI = ( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	settings,
} ) => {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount="firstElement"
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-color components-inline-color-popover"
		>
			<ColorPicker name={ name } value={ value } onChange={ onChange } />
		</Popover>
	);
};

export default InlineColorUI;
