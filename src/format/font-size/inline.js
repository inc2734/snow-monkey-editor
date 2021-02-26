import { useMemo } from '@wordpress/element';
import { withSpokenMessages } from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';

import {
	FontSizePicker as BaseFontSizePicker,
	URLPopover,
} from '@wordpress/block-editor';

const FontSizePopoverAtLink = ( { addingFontSize, ...props } ) => {
	const anchorRect = useMemo( () => {
		// eslint-disable-next-line @wordpress/no-global-get-selection
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingFontSize ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'span' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [] );

	if ( ! anchorRect ) {
		return null;
	}

	return <URLPopover anchorRect={ anchorRect } { ...props } />;
};

const FontSizePicker = ( {
	name,
	value,
	getActiveFontSize,
	onFontSizeChange,
	fontSizes,
} ) => {
	const activeFontSize = useMemo( () => getActiveFontSize( name, value ), [
		name,
		value,
	] );

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
	onClose,
	addingFontSize,
	getActiveFontSize,
	onFontSizeChange,
	fontSizes,
} ) => {
	return (
		<FontSizePopoverAtLink
			value={ value }
			addingFontSize={ addingFontSize }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
		>
			<FontSizePicker
				name={ name }
				value={ value }
				getActiveFontSize={ getActiveFontSize }
				onFontSizeChange={ onFontSizeChange }
				fontSizes={ fontSizes }
			/>
		</FontSizePopoverAtLink>
	);
};

export default withSpokenMessages( InlineFontSizeUI );
