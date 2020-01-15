'use strict';

import {
	useState,
} from '@wordpress/element';

import {
	ColorPalette,
	URLPopover,
} from '@wordpress/block-editor';

import rgb2hex from 'rgb2hex';
import hexLong2Short from '../helper/hex-long2short';
import getPopoverAnchorRect from '../helper/get-popover-anchor-rect';

export default function( { onChange } ) {
	const [ color, setColor ] = useState( undefined );

	const {
		anchorRect,
		current,
	} = getPopoverAnchorRect( ( currentNode ) => {
		const node = currentNode.closest( '.sme-highlighter' );
		if ( node ) {
			const styles = node.style;
			const backgroundImage = styles.backgroundImage ? styles.backgroundImage : undefined;
			if ( 'undefined' === typeof backgroundImage ) {
				return undefined;
			}

			const hex = backgroundImage.match( /(#[0-9A-F]{3,6}) /i );
			if ( hex ) {
				return hexLong2Short( hex[ 1 ] );
			}

			const rgb = backgroundImage.match( /,\s*?(rgba?\([^)]+\)) /i );
			if ( rgb ) {
				return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
			}
		}
	} );

	return (
		<URLPopover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<ColorPalette
					value={ color ? color : current }
					onChange={ ( newColor ) => {
						setColor( newColor );
						onChange( newColor );
					} }
				/>
			</div>
		</URLPopover>
	);
}
