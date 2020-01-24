'use strict';

import {
	__,
} from '@wordpress/i18n';

export const options = [
	{ label: '', value: '' },
	{ label: __( 'bounce-in', 'snow-monkey-editor' ), value: 'bounce-in' },
	{ label: __( 'bounce-down', 'snow-monkey-editor' ), value: 'bounce-down' },
	{ label: __( 'fade-in', 'snow-monkey-editor' ), value: 'fade-in' },
];

export const classes = Object.values( options ).map( ( element ) => {
	return element.value && `sme-animation-${ element.value }`;
} ).filter( ( element ) => element );
