'use strict';

import rgb2hex from 'rgb2hex';

import {
	BaseControl,
	Popover,
} from '@wordpress/components';

import {
	useState,
} from '@wordpress/element';

import {
	__,
} from '@wordpress/i18n';

import ColorPalette from '../component/color-palette';
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
		<Popover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<BaseControl
					id="snow-monkey-editor/format/bg-color/popover"
					label={ __( 'Background color', 'snow-monkey-editor' ) }
				>
					<ColorPalette
						value={ setting || getCurrentSetting() }
						onChange={ ( value ) => {
							const hex = value.hex || value;
							setSetting( hex );
							onChange( hex );
						} }
					/>
				</BaseControl>
			</div>
		</Popover>
	);
}
