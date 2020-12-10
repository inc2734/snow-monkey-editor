import { useMemo } from '@wordpress/element';
import { withSpokenMessages, RangeControl } from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import { __ } from '@wordpress/i18n';

import { URLPopover } from '@wordpress/block-editor';

const LetterSpacingPopoverAtLink = ( { addingLetterSpacing, ...props } ) => {
	const anchorRect = useMemo( () => {
		// eslint-disable-next-line @wordpress/no-global-get-selection
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingLetterSpacing ) {
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

const LetterSpacingPicker = ( {
	name,
	value,
	getActiveLetterSpacing,
	onLetterSpacingChange,
} ) => {
	const activeLetterSpacing = useMemo(
		() => getActiveLetterSpacing( name, value ),
		[ name, value ]
	);

	return (
		<RangeControl
			label={ __( 'Letter spacing', 'snow-monkey-editor' ) }
			value={ activeLetterSpacing }
			onChange={ onLetterSpacingChange }
			min="0"
			max="2"
			step="0.1"
			initialPosition="0"
			allowReset
		/>
	);
};

const InlineLetterSpacingUI = ( {
	name,
	value,
	onClose,
	addingLetterSpacing,
	getActiveLetterSpacing,
	onLetterSpacingChange,
} ) => {
	return (
		<LetterSpacingPopoverAtLink
			value={ value }
			addingLetterSpacing={ addingLetterSpacing }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
		>
			<LetterSpacingPicker
				name={ name }
				value={ value }
				getActiveLetterSpacing={ getActiveLetterSpacing }
				onLetterSpacingChange={ onLetterSpacingChange }
			/>
		</LetterSpacingPopoverAtLink>
	);
};

export default withSpokenMessages( InlineLetterSpacingUI );
