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
		const node = currentNode.closest( '.sme-highlighter' );
		if ( ! node ) {
			return undefined;
		}

		const currentSetting = node.style.backgroundImage || undefined;
		if ( ! currentSetting ) {
			return undefined;
		}

		const hex = currentSetting.match( /(#[0-9A-F]{3,6}) /i );
		if ( hex ) {
			return hexLong2Short( hex[ 1 ] );
		}

		const rgb = currentSetting.match( /,\s*?(rgba?\([^)]+\)) /i );
		if ( rgb ) {
			return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
		}

		return undefined;
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
