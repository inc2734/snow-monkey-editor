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

const LineHeightPicker = ( { name, title, value, onChange, onReset } ) => {
	const activeLineHeight = useMemo(
		() => getActiveLineHeight( name, value ),
		[ name, value ]
	);

	return (
		<>
			<RangeControl
				label={ title }
				value={ activeLineHeight }
				onChange={ onChange }
				min="0"
				max="5"
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

const InlineLineHeightUI = ( {
	name,
	title,
	value,
	onChange,
	onClose,
	onReset,
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

	const rect = useMemo( () => popoverAnchor.getBoundingClientRect(), [] );
	if ( !! popoverAnchor?.ownerDocument ) {
		popoverAnchor.getBoundingClientRect = () => rect;
	}

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-line-height components-inline-color-popover"
		>
			<fieldset>
				<LineHeightPicker
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

export default withSpokenMessages( InlineLineHeightUI );
