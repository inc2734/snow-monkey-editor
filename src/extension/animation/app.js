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
				if ( ! entry.isIntersecting ) {
					return;
				}

				const target = entry.target;

				classes.forEach( ( element ) => {
					if ( ! target.classList.contains( element ) ) {
						return;
					}

					target.classList.replace( element, `${ element }-fired` );

					const animationDelay = target.getAttribute(
						'data-sme-animation-delay'
					);
					if ( 0 < animationDelay ) {
						target.style.animationDelay = `${ animationDelay }s`;
					}

					const animationDuration = target.getAttribute(
						'data-sme-animation-duration'
					);
					if ( 0 < animationDuration ) {
						target.style.animationDuration = `${ animationDuration }s`;
					}
				} );

				if ( !! observer ) {
					observer.unobserve( target );
				}
			} );
		};

		const options = {
			root: null,
			rootMargin: '-25% 0px',
			threshold: [ 0, 0.25, 0.5, 0.75, 1 ],
		};

		const observer = new IntersectionObserver( callback, options );

		forEachHtmlNodes( targets, ( target ) => {
			const rect = target.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const isInView = 0 <= rect.top && rect.top <= windowHeight;

			if ( isInView ) {
				// 交差状態を手動で処理（callback と同じ処理をここに入れるか呼び出す）
				callback( [
					{ target, isIntersecting: true, intersectionRatio: 1 },
				] );
			}

			observer.observe( target );

			target.addEventListener(
				'animationend',
				() => {
					classes.forEach( ( element ) => {
						//target.classList.remove( element );
						target.classList.remove( `${ element }-fired` );
					} );
				},
				false
			);
		} );
	},
	false
);
