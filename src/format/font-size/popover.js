'use strict';

import {
	find,
} from 'lodash';

import {
	BaseControl,
	FontSizePicker,
	Popover,
} from '@wordpress/components';

import {
	useSelect,
} from '@wordpress/data';

import {
	useState,
} from '@wordpress/element';

import {
	__,
} from '@wordpress/i18n';

export default function( { currentNode, currentSetting, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	const fontSizes = useSelect( ( select ) => select( 'core/block-editor' ).getSettings().fontSizes );

	const numbered = ( value ) => {
		if ( 'number' === typeof value ) {
			return value;
		}

		if ( 'string' !== typeof value ) {
			return undefined;
		}

		const matches = value.match( /^([\d]*?)px$/i );
		if ( ! matches ) {
			return undefined;
		}

		return Number( matches[ 1 ] );
	};

	return (
		<Popover
			className="sme-popover"
			focusOnMount={ false }
			anchorRect={ anchorRect }
		>
			<div className="sme-popover__inner">
				<BaseControl
					id="snow-monkey-editor/format/font-size/popover"
					label={ __( 'Font size', 'snow-monkey-editor' ) }
				>
					<FontSizePicker
						fontSizes={ fontSizes }
						disableCustomFontSizes={ true }
						value={ numbered( !! setting && setting.size ) || numbered( currentSetting ) }
						onChange={ ( value ) => {
							const matched = find( fontSizes, [ 'size', value ] );
							const key = 'undefined' !== typeof matched ? matched.slug : 'custom';

							const newSetting = {
								size: value,
								class: `has-${ key }-font-size`,
							};
							setSetting( newSetting );
							onChange( newSetting );
						} }
					/>
				</BaseControl>
			</div>
		</Popover>
	);
}
