import {
	getColorObjectByAttributeValues,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';
import { Popover } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function getActiveBackgroundColor( formatName, formatValue, colors ) {
	const activeBackgroundColorFormat = getActiveFormat(
		formatValue,
		formatName
	);
	if ( ! activeBackgroundColorFormat ) {
		return;
	}

	const styleBackgroundColor = activeBackgroundColorFormat.attributes.style;
	if ( styleBackgroundColor ) {
		return styleBackgroundColor.replace(
			new RegExp( `^background-color:\\s*` ),
			''
		);
	}

	const currentClass = activeBackgroundColorFormat.attributes.class;
	if ( currentClass ) {
		const colorSlug = currentClass.replace(
			/.*has-([^\s]*)-background-color.*/,
			'$1'
		);
		return getColorObjectByAttributeValues( colors, colorSlug ).color;
	}
}

const ColorPicker = ( { name, value, onChange } ) => {
	const multipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradients();

	const activeBackgroundColor = useMemo(
		() =>
			getActiveBackgroundColor(
				name,
				value,
				multipleOriginColorsAndGradients?.colors
			),
		[ name, value, multipleOriginColorsAndGradients?.colors ]
	);

	return (
		<ColorGradientControl
			label={ __( 'Color', 'snow-monkey-editor' ) }
			colorValue={ activeBackgroundColor }
			onColorChange={ onChange }
			{ ...multipleOriginColorsAndGradients }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
};

const InlineBackgroundColorUI = ( {
	name,
	value,
	onChange,
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
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="sme-popover sme-popover--inline-background-color components-inline-color-popover"
		>
			<ColorPicker name={ name } value={ value } onChange={ onChange } />
		</Popover>
	);
};

export default InlineBackgroundColorUI;
