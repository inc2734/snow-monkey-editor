'use strict';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	addFilter,
} from '@wordpress/hooks';

import settings from './settings';
import blocks from './blocks';

export default blocks.map(
	( name ) => {
		return {
			name,
			settings,
		};
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/ordered-list-square/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					name,
					clientId,
				} = props;

				const {
					start,
					reversed,
					ordered,
				} = attributes;

				if ( 'core/list' !== name ) {
					return <BlockEdit { ...props } />;
				}

				const block = document.querySelector( `[data-block="${ clientId }"] .rich-text` );
				if ( ! block ) {
					return <BlockEdit { ...props } />;
				}

				if ( ! block.classList.contains( 'is-style-sme-ordered-list-square' ) ) {
					block.style.counterReset = '';
					return <BlockEdit { ...props } />;
				}

				if ( ! ordered ) {
					block.style.counterReset = '';
				} else {
					block.style.counterReset = reversed ? `sme-count ${ start + 1 }` : `sme-count ${ start - 1 }`;
				}

				return <BlockEdit { ...props } />;
			};
		},
		'withSnowMonkeyEditorOrderdListSquareBlockEdit'
	)
);
