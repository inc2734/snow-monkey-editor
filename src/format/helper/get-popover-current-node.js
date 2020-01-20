'use strict';

export default function() {
	const selection = window.getSelection();
	if ( ! selection.rangeCount ) {
		return;
	}

	const range = selection.getRangeAt( 0 );

	let element = range.startContainer;
	element = element.nextElementSibling || element;
	while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
		element = element.parentNode;
	}

	if ( element.textContent === range.endContainer.textContent ) {
		return element;
	}

	if ( range.startContainer.textContent === range.endContainer.textContent ) {
		return range.endContainer.parentNode;
	}
}
