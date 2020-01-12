'use strict';

export default function( callback ) {
	const selection = window.getSelection();
	if ( 1 > selection.rangeCount || 'Range' !== selection.type ) {
		return {};
	}

	const range = selection.getRangeAt( 0 );

	const startContainer = range.startContainer;
	let currentNode = startContainer.nextElementSibling || startContainer;
	while ( currentNode.nodeType !== window.Node.ELEMENT_NODE ) {
		currentNode = currentNode.parentNode;
	}

	const current = currentNode.closest ? callback( currentNode ) : null;

	return {
		anchorRect: currentNode.getBoundingClientRect(),
		current,
	};
}
