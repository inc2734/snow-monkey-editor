import { get, find } from 'lodash';

import {
	FontSizePicker as BaseFontSizePicker,
	URLPopover,
	getFontSizeClass,
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

export function getActiveFontSize( formatName, formatValue, fontSizes ) {
	const activeFontSizeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFontSizeFormat ) {
		return;
	}
	const styleFontSize = activeFontSizeFormat.attributes.style;
	if ( styleFontSize ) {
		return styleFontSize.replace( new RegExp( `^font-size:\\s*` ), '' );
	}
	const currentClass = activeFontSizeFormat.attributes.class;
	if ( currentClass ) {
		const fontSizeSlug = currentClass.replace(
			/.*has-([^\s]*)-font-size.*/,
			'$1'
		);
		const fontSizObject = find( fontSizes, { slug: fontSizeSlug } );
		return fontSizObject.size;
	}
}

const FontSizePicker = ( { name, value, onChange, onClose } ) => {
	const fontSizes = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'fontSizes' ], [] );
	} );

	const onFontSizeChange = useCallback(
		( fontSize ) => {
			if ( fontSize ) {
				const isPixelValue =
					typeof fontSize === 'string' && fontSize.endsWith( 'px' );
				const fontSizeWithPx = isPixelValue
					? fontSize
					: `${ fontSize }px`;
				const fontSizeNumber = ! isPixelValue
					? fontSize
					: Number( fontSizeWithPx.replace( 'px', '' ) );
				const fontSizObject = find( fontSizes, {
					size: fontSizeNumber,
				} );
				onChange(
					applyFormat( value, {
						type: name,
						attributes: fontSizObject
							? {
									class: getFontSizeClass(
										fontSizObject.slug
									),
							  }
							: {
									style: `font-size: ${ fontSizeWithPx }`,
							  },
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
				onClose();
			}
		},
		[ fontSizes, onChange ]
	);

	const activeFontSize = useMemo(
		() => getActiveFontSize( name, value, fontSizes ),
		[ name, value ]
	);

	return (
		<BaseFontSizePicker
			value={ activeFontSize }
			onChange={ onFontSizeChange }
			fontSizes={ fontSizes }
		/>
	);
};

const InlineFontSizeUI = ( {
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
			<FontSizePicker
				name={ name }
				value={ value }
				onChange={ onChange }
				onClose={ onClose }
			/>
		</URLPopover>
	);
};

export default withSpokenMessages( InlineFontSizeUI );
