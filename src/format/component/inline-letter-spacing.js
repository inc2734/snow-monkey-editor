import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';

import {
	RangeControl,
	withSpokenMessages,
	Popover,
} from '@wordpress/components';

import { useCachedTruthy } from '@wordpress/block-editor';
import { useCallback, useMemo } from '@wordpress/element';

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

const LetterSpacingPicker = ( { name, title, value, onChange } ) => {
	const onLetterSpacingChange = useCallback(
		( letterSpacing ) => {
			if ( !! letterSpacing ) {
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
	const popoverAnchor = useCachedTruthy(
		useAnchor( {
			editableContentElement: contentRef.current,
			value,
			settings,
		} )
	);

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-letter-spacing components-inline-color-popover"
		>
			<fieldset>
				<LetterSpacingPicker
					name={ name }
					title={ title }
					value={ value }
					onChange={ onChange }
				/>
			</fieldset>
		</Popover>
	);
};

export default withSpokenMessages( InlineLetterSpacingUI );
