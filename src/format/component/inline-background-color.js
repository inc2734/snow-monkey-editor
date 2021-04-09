import { get } from 'lodash';

import {
	ColorPalette,
	URLPopover,
	getColorClassName,
	getColorObjectByColorValue,
	getColorObjectByAttributeValues,
} from '@wordpress/block-editor';
import { withSpokenMessages } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { useAnchorRef } from './use-anchor-ref';

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

const ColorPicker = ( { name, value, onChange, onClose } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const onBackgroundColorChange = useCallback(
		( color ) => {
			if ( color ) {
				const colorObject = getColorObjectByColorValue( colors, color );
				onChange(
					applyFormat( value, {
						type: name,
						attributes: colorObject
							? {
									class: getColorClassName(
										'background-color',
										colorObject.slug
									),
							  }
							: {
									style: `background-color: ${ color }`,
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

	const activeBackgroundColor = useMemo(
		() => getActiveBackgroundColor( name, value, colors ),
		[ name, value, colors ]
	);

	return (
		<ColorPalette
			value={ activeBackgroundColor }
			onChange={ onBackgroundColorChange }
		/>
	);
};

const InlineBackgroundColorUI = ( {
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

export default withSpokenMessages( InlineBackgroundColorUI );
