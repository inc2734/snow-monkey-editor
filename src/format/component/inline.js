import { get } from 'lodash';

import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { withSpokenMessages } from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';

import { ColorPalette, URLPopover } from '@wordpress/block-editor';

const ColorPopoverAtLink = ( { addingColor, ...props } ) => {
	const anchorRect = useMemo( () => {
		// eslint-disable-next-line @wordpress/no-global-get-selection
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingColor ) {
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

const ColorPicker = ( { name, value, getActiveColor, onColorChange } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const activeColor = useMemo( () => getActiveColor( name, value ), [
		name,
		value,
		colors,
	] );

	return <ColorPalette value={ activeColor } onChange={ onColorChange } />;
};

const InlineColorUI = ( {
	name,
	value,
	onClose,
	isActive,
	addingColor,
	getActiveColor,
	onColorChange,
} ) => {
	return (
		<ColorPopoverAtLink
			value={ value }
			isActive={ isActive }
			addingColor={ addingColor }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
		>
			<ColorPicker
				name={ name }
				value={ value }
				getActiveColor={ getActiveColor }
				onColorChange={ onColorChange }
			/>
		</ColorPopoverAtLink>
	);
};

export default withSpokenMessages( InlineColorUI );
