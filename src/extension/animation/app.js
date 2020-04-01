import forEachHtmlNodes from '@inc2734/for-each-html-nodes';

import { classes } from './helper';

document.addEventListener(
	'DOMContentLoaded',
	() => {
		const targets = document.querySelectorAll(
			'[class*="sme-animation-"]'
		);

		if ( 'undefined' === typeof IntersectionObserver ) {
			forEachHtmlNodes( targets, ( target ) => {
				classes.forEach( ( element ) => {
					target.classList.remove( element );
				} );
			} );
			return;
		}

		const callback = ( entries, observer ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					const target = entry.target;
					classes.forEach( ( element ) => {
						target.classList.replace(
							element,
							`${ element }-fired`
						);
					} );
					observer.unobserve( target );
				}
			} );
		};

		const options = {
			root: null,
			rootMargin: '-25% 0px',
			thureshold: [ 0, 0.25, 0.5, 0.75, 1 ],
		};

		const observer = new IntersectionObserver( callback, options );

		forEachHtmlNodes( targets, ( target ) => {
			observer.observe( target );

			target.addEventListener(
				'animationend',
				() => {
					classes.forEach( ( element ) => {
						target.classList.remove( `${ element }-fired` );
					} );
				},
				false
			);
		} );
	},
	false
);
