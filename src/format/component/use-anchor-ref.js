import { useMemo } from '@wordpress/element';
import { getActiveFormat } from '@wordpress/rich-text';

export function useAnchorRef( { ref, value, settings = {} } ) {
	const { tagName, className, name } = settings;
	const activeFormat = name ? getActiveFormat( value, name ) : undefined;

	return useMemo( () => {
		if ( ! ref.current ) return;
		const {
			ownerDocument: { defaultView },
		} = ref.current;
		const selection = defaultView.getSelection();

		if ( ! selection.rangeCount ) {
			return;
		}

		const range = selection.getRangeAt( 0 );

		if ( ! activeFormat ) {
			return range;
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== element.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		return element.closest(
			tagName + ( className ? '.' + className : '' )
		);
	}, [] );
}
