'use strict';

import { getRectangleFromRange } from '@wordpress/dom';

export default function( addingSetting = false ) {
	const selection = window.getSelection();
	if ( ! selection.rangeCount ) {
		return;
	}

	const range = selection.getRangeAt( 0 );
	if ( ! range ) {
		return;
	}

	if ( addingSetting ) {
		return getRectangleFromRange( range );
	}

	let element = range.startContainer;
	element = element.nextElementSibling || element;
	while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
		element = element.parentNode;
	}

	const closest = element.closest( 'span' );
	if ( ! closest ) {
		return;
	}

	return closest.getBoundingClientRect();

	/*
	if ( element.textContent === range.endContainer.textContent ) {
		return element;
	}

	if ( range.startContainer.textContent === range.endContainer.textContent ) {
		return range.endContainer.parentNode;
	}
	*/
}
