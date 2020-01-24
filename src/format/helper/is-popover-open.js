'use strict';

import {
	last,
} from 'lodash';

import getPopoverCurrentNode from './get-popover-current-node';

export default function( name, value ) {
	const currentNode = getPopoverCurrentNode();
	if ( ! currentNode ) {
		return false;
	}

	// When open custom color popover
	if ( 'undefined' === typeof value.activeFormats ) {
		return true;
	}

	if ( 1 > value.activeFormats.length ) {
		return false;
	}

	const format = last( value.activeFormats );
	if ( 'undefined' === typeof format ) {
		return false;
	}

	if ( name !== format.type ) {
		return false;
	}

	return true;
}
