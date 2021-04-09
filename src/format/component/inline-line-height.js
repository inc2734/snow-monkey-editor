import { URLPopover } from '@wordpress/block-editor';
import { RangeControl, withSpokenMessages } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { useAnchorRef } from './use-anchor-ref';

export function getActiveLineHeight( formatName, formatValue ) {
	const activeLineHeightFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeLineHeightFormat ) {
		return;
	}
	const styleLineHeight = activeLineHeightFormat.attributes.style;
	if ( styleLineHeight ) {
		return parseFloat(
			styleLineHeight
				.replace( new RegExp( `^line-height:\\s*` ), '' )
				.replace( 'rem', '' )
		);
	}
}

const LineHeightPicker = ( { name, title, value, onChange, onClose } ) => {
	const onLineHeightChange = useCallback(
		( lineHeight ) => {
			if ( lineHeight ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `line-height: ${ lineHeight }rem`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
				onClose();
			}
		},
		[ onChange ]
	);

	const activeLineHeight = useMemo(
		() => getActiveLineHeight( name, value ),
		[ name, value ]
	);

	return (
		<RangeControl
			label={ title }
			value={ activeLineHeight }
			onChange={ onLineHeightChange }
			min="0"
			max="5"
			step="0.1"
			initialPosition={ undefined }
			allowReset
		/>
	);
};

const InlineLineHeightUI = ( {
	name,
	title,
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
			<LineHeightPicker
				name={ name }
				title={ title }
				value={ value }
				onChange={ onChange }
				onClose={ onClose }
			/>
		</URLPopover>
	);
};

export default withSpokenMessages( InlineLineHeightUI );
