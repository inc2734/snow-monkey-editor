import { registerStyle } from './helper/register-style';

import { addFilter } from '@wordpress/hooks';

import { createHigherOrderComponent } from '@wordpress/compose';

import alert from './alert/editor';
import alertSuccess from './alert-success/editor';
import alertWarning from './alert-warning/editor';
import alertRemark from './alert-remark/editor';
import fluidShape1 from './fluid-shape-1/editor';
import fluidShape2 from './fluid-shape-2/editor';
import fluidShape3 from './fluid-shape-3/editor';
import listArrow from './list-arrow/editor';
import listCheck from './list-check/editor';
import listRemark from './list-remark/editor';
import listTimes from './list-times/editor';
import orderedListCircle from './ordered-list-circle/editor';
import orderedListSquare from './ordered-list-square/editor';
import postIt from './post-it/editor';
import postItNarrow from './post-it-narrow/editor';
import shadowed from './shadowed/editor';
import speech from './speech/editor';

[
	alert,
	alertSuccess,
	alertWarning,
	alertRemark,
	fluidShape1,
	fluidShape2,
	fluidShape3,
	listArrow,
	listCheck,
	listRemark,
	listTimes,
	orderedListCircle,
	orderedListSquare,
	postIt,
	postItNarrow,
	shadowed,
	speech,
].forEach( ( component ) => {
	component.forEach( ( props ) => registerStyle( props ) );
} );

/**
 * For orderd list styles
 */
addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/ordered-list/block-edit',
	createHigherOrderComponent( ( BlockEdit ) => {
		return ( props ) => {
			const { attributes, name, clientId } = props;

			const { start, reversed, ordered } = attributes;

			if ( 'core/list' !== name ) {
				return <BlockEdit { ...props } />;
			}

			const block = document.querySelector(
				`[data-block="${ clientId }"].rich-text`
			);
			if ( ! block ) {
				return <BlockEdit { ...props } />;
			}

			if (
				! block.classList.contains(
					'is-style-sme-ordered-list-square'
				) &&
				! block.classList.contains( 'is-style-sme-ordered-list-circle' )
			) {
				block.style.counterReset = '';
				return <BlockEdit { ...props } />;
			}

			if ( ! ordered ) {
				block.style.counterReset = '';
			} else {
				block.style.counterReset = reversed
					? `sme-count ${ start + 1 }`
					: `sme-count ${ start - 1 }`;
			}

			return <BlockEdit { ...props } />;
		};
	}, 'withSnowMonkeyEditorOrderdListBlockEdit' )
);
