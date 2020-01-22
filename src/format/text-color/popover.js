'use strict';

import rgb2hex from 'rgb2hex';

import {
	ColorPalette,
	URLPopover,
} from '@wordpress/block-editor';

import {
	BaseControl,
} from '@wordpress/components';

import {
	useState,
} from '@wordpress/element';

import {
	__,
} from '@wordpress/i18n';

import hexLong2Short from '../helper/hex-long2short';

export default function( { currentNode, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	const getCurrentSetting = () => {
		const node = currentNode.closest( '.sme-text-color' );
		if ( ! node ) {
			return undefined;
		}

		const currentSetting = node.style.color || undefined;
		return !! currentSetting ? hexLong2Short( rgb2hex( currentSetting ).hex ) : undefined;
	};

	return (
		<URLPopover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<BaseControl
					id="snow-monkey-editor/format/text-color/popover"
					label={ __( 'Text color', 'snow-monkey-editor' ) }
				>
					<ColorPalette
						value={ setting || getCurrentSetting() }
						onChange={ ( value ) => {
							setSetting( value );
							onChange( value );
						} }
					/>
				</BaseControl>
			</div>
		</URLPopover>
	);
}
