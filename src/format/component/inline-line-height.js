import {
	RangeControl,
	withSpokenMessages,
	Popover,
	Button,
} from '@wordpress/components';

import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';

import { useCachedTruthy } from '@wordpress/block-editor';
import { useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function getActiveLineHeight( formatName, formatValue ) {
	const activeLineHeightFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeLineHeightFormat ) {
		return;
	}
	const styleLineHeight = activeLineHeightFormat.attributes.style;
	if ( styleLineHeight ) {
		return parseFloat(
			styleLineHeight.replace( new RegExp( `^line-height:\\s*` ), '' )
		);
	}
}

const LineHeightPicker = ( { name, title, value, onChange, onClose } ) => {
	const onLineHeightChange = useCallback(
		( lineHeight ) => {
			if ( !! lineHeight ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `line-height: ${ lineHeight }`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ onChange ]
	);

	const activeLineHeight = useMemo(
		() => getActiveLineHeight( name, value ),
		[ name, value ]
	);

	return (
		<>
			<RangeControl
				label={ title }
				value={ activeLineHeight }
				onChange={ onLineHeightChange }
				min="0"
				max="5"
				step="0.1"
				initialPosition={ undefined }
			/>

			<Button
				disabled={ value === undefined }
				variant="secondary"
				isSmall
				onClick={ () => {
					onChange( removeFormat( value, name ) );
					onClose();
				} }
			>
				{ __( 'Reset' ) }
			</Button>
		</>
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
			value={ value }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-line-height components-inline-color-popover"
		>
			<fieldset>
				<LineHeightPicker
					name={ name }
					title={ title }
					value={ value }
					onChange={ onChange }
					onClose={ onClose }
				/>
			</fieldset>
		</Popover>
	);
};

export default withSpokenMessages( InlineLineHeightUI );
