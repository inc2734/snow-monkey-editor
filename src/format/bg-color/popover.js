'use strict';

import rgb2hex from 'rgb2hex';

import {
	ColorPalette,
	URLPopover,
} from '@wordpress/block-editor';

import {
	useState,
} from '@wordpress/element';

import hexLong2Short from '../helper/hex-long2short';

export default function( { currentNode, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	const getCurrentSetting = () => {
		const node = currentNode.closest( '.sme-bg-color' );
		if ( ! node ) {
			return undefined;
		}

		const currentSetting = node.style.backgroundColor || undefined;
		return !! currentSetting ? hexLong2Short( rgb2hex( currentSetting ).hex ) : undefined;
	};

	return (
		<URLPopover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<ColorPalette
					value={ setting || getCurrentSetting() }
					onChange={ ( value ) => {
						setSetting( value );
						onChange( value );
					} }
				/>
			</div>
		</URLPopover>
	);
}
