import { useMemo } from '@wordpress/element';
import { withSpokenMessages, RangeControl } from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import { __ } from '@wordpress/i18n';

import { URLPopover } from '@wordpress/block-editor';

const LineHeightPopoverAtLink = ( { addingLineHeight, ...props } ) => {
	const anchorRect = useMemo( () => {
		// eslint-disable-next-line @wordpress/no-global-get-selection
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingLineHeight ) {
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

const LineHeightPicker = ( {
	name,
	value,
	getActiveLineHeight,
	onLineHeightChange,
} ) => {
	const activeLineHeight = useMemo(
		() => getActiveLineHeight( name, value ),
		[ name, value ]
	);

	return (
		<RangeControl
			label={ __( 'Line height', 'snow-monkey-editor' ) }
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
	value,
	onClose,
	addingLineHeight,
	getActiveLineHeight,
	onLineHeightChange,
} ) => {
	return (
		<LineHeightPopoverAtLink
			value={ value }
			addingLineHeight={ addingLineHeight }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
		>
			<LineHeightPicker
				name={ name }
				value={ value }
				getActiveLineHeight={ getActiveLineHeight }
				onLineHeightChange={ onLineHeightChange }
			/>
		</LineHeightPopoverAtLink>
	);
};

export default withSpokenMessages( InlineLineHeightUI );
