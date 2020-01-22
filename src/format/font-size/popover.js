'use strict';

import {
	find,
} from 'lodash';

import {
	URLPopover,
} from '@wordpress/block-editor';

import {
	BaseControl,
	FontSizePicker,
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

export default function( { currentNode, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	const getCurrentSetting = () => {
		const node = currentNode.closest( '.sme-font-size' );
		if ( ! node ) {
			return undefined;
		}

		const currentSetting = node.style.fontSize || undefined;
		return !! currentSetting ? currentSetting : undefined;
	};

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
		<URLPopover
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
						value={ numbered( !! setting && setting.size ) || numbered( getCurrentSetting() ) }
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
		</URLPopover>
	);
}
