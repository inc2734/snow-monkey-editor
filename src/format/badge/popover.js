'use strict';

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

export default function( { currentNode, currentSetting, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	return (
		<Popover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<BaseControl
					id="snow-monkey-editor/format/badge/popover"
					label={ __( 'Badge', 'snow-monkey-editor' ) }
				>
					<ColorPalette
						value={ setting || currentSetting }
						onChange={ ( value ) => {
							const hex = value && value.hex || value;
							setSetting( hex );
							onChange( hex );
						} }
					/>
				</BaseControl>
			</div>
		</Popover>
	);
}
