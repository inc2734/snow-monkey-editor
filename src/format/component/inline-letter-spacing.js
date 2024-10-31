import {
	RangeControl,
	withSpokenMessages,
	Popover,
	Button,
} from '@wordpress/components';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';

import { useCachedTruthy } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function getActiveLetterSpacing( formatName, formatValue ) {
	const activeLetterSpacingFormat = getActiveFormat(
		formatValue,
		formatName
	);
	if ( ! activeLetterSpacingFormat ) {
		return;
	}

	const styleLetterSpacing = activeLetterSpacingFormat.attributes?.style;
	if ( styleLetterSpacing ) {
		return parseFloat(
			styleLetterSpacing
				.replace( new RegExp( `^letter-spacing:\\s*` ), '' )
				.replace( 'rem', '' )
		);
	}
}

const LetterSpacingPicker = ( { name, title, value, onChange, onReset } ) => {
	const activeLetterSpacing = useMemo(
		() => getActiveLetterSpacing( name, value ),
		[ name, value ]
	);

	return (
		<>
			<RangeControl
				__nextHasNoMarginBottom
				label={ title }
				value={ activeLetterSpacing }
				onChange={ onChange }
				min="0"
				max="2"
				step="0.1"
				initialPosition={ undefined }
			/>

			<Button
				disabled={ value === undefined }
				variant="secondary"
				isSmall
				onClick={ onReset }
			>
				{ __( 'Reset' ) }
			</Button>
		</>
	);
};

const InlineLetterSpacingUI = ( {
	name,
	title,
	value,
	onChange,
	onClose,
	onReset,
	contentRef,
	settings,
} ) => {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

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
					onReset={ onReset }
				/>
			</fieldset>
		</Popover>
	);
};

export default withSpokenMessages( InlineLetterSpacingUI );
