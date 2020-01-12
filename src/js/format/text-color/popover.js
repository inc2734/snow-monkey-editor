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
		const node = currentNode.closest( '.sme-text-color' );
		if ( node ) {
			const styles = node.style;
			return styles.color ? hexLong2Short( rgb2hex( styles.color ).hex ) : undefined;
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
