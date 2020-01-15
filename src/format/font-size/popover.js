'use strict';

import {
	find,
} from 'lodash';

import {
	useSelect,
} from '@wordpress/data';

import {
	useState,
} from '@wordpress/element';

import {
	URLPopover,
} from '@wordpress/block-editor';

import {
	FontSizePicker,
} from '@wordpress/components';

import getPopoverAnchorRect from '../helper/get-popover-anchor-rect';

export default function( { onChange } ) {
	const [ fontSize, setFontSize ] = useState( undefined );

	const fontSizes = useSelect( ( select ) => select( 'core/block-editor' ).getSettings().fontSizes );

	const {
		anchorRect,
		current,
	} = getPopoverAnchorRect( ( currentNode ) => {
		const node = currentNode.closest( '.sme-font-size' );
		if ( node ) {
			const styles = node.style;
			return styles.fontSize ? styles.fontSize : undefined;
		}
	} );

	const numberedFontSize = ( () => {
		if ( 'undefined' === typeof fontSize ) {
			return undefined;
		}

		if ( 'string' !== typeof fontSize.size && 'number' !== typeof fontSize.size ) {
			return undefined;
		}

		if ( 'number' === typeof fontSize.size ) {
			return typeof fontSize.size;
		}

		const matches = fontSize.size.match( /^([\d]*?)px$/i );
		if ( ! matches ) {
			return undefined;
		}

		return Number( matches[ 1 ] );
	} )();

	const numberedCurrent = ( () => {
		if ( 'string' !== typeof current && 'number' !== typeof current ) {
			return undefined;
		}

		const matches = current.match( /^([\d]*?)px$/i );
		if ( ! matches ) {
			return undefined;
		}

		return Number( matches[ 1 ] );
	} )();

	return (
		<URLPopover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<FontSizePicker
					fontSizes={ fontSizes }
					disableCustomFontSizes={ true }
					value={ numberedFontSize ? numberedFontSize : numberedCurrent }
					onChange={ ( newFontSizeValue ) => {
						const newFontSizeObject = find( fontSizes, [ 'size', newFontSizeValue ] );
						const newFontSizeKey = 'undefined' !== typeof newFontSizeObject ? newFontSizeObject.slug : 'custom';

						const newFontSize = {
							size: newFontSizeValue,
							class: `has-${ newFontSizeKey }-font-size`,
						};
						setFontSize( newFontSize );
						onChange( newFontSize );
					} }
				/>
			</div>
		</URLPopover>
	);
}
