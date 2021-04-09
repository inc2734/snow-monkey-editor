import { URLPopover } from '@wordpress/block-editor';
import { RangeControl, withSpokenMessages } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';

import { useAnchorRef } from './use-anchor-ref';

export function getActiveLetterSpacing( formatName, formatValue ) {
	const activeLetterSpacingFormat = getActiveFormat(
		formatValue,
		formatName
	);
	if ( ! activeLetterSpacingFormat ) {
		return;
	}
	const styleLetterSpacing = activeLetterSpacingFormat.attributes.style;
	if ( styleLetterSpacing ) {
		return parseFloat(
			styleLetterSpacing
				.replace( new RegExp( `^letter-spacing:\\s*` ), '' )
				.replace( 'rem', '' )
		);
	}
}

const LetterSpacingPicker = ( { name, title, value, onChange, onClose } ) => {
	const onLetterSpacingChange = useCallback(
		( letterSpacing ) => {
			if ( letterSpacing ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `letter-spacing: ${ letterSpacing }rem`,
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

	const activeLetterSpacing = useMemo(
		() => getActiveLetterSpacing( name, value ),
		[ name, value ]
	);

	return (
		<RangeControl
			label={ title }
			value={ activeLetterSpacing }
			onChange={ onLetterSpacingChange }
			min="0"
			max="2"
			step="0.1"
			initialPosition={ undefined }
			allowReset
		/>
	);
};

const InlineLetterSpacingUI = ( {
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
			<LetterSpacingPicker
				name={ name }
				title={ title }
				value={ value }
				onChange={ onChange }
				onClose={ onClose }
			/>
		</URLPopover>
	);
};

export default withSpokenMessages( InlineLetterSpacingUI );
