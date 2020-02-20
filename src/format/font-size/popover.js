'use strict';

import {
	find,
} from 'lodash';

import {
	BaseControl,
	FontSizePicker,
	SelectControl,
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

export default function( { currentNode, onChange } ) {
	const [ setting, setSetting ] = useState( undefined );

	const anchorRect = currentNode.getBoundingClientRect();

	const getCurrentSize = () => {
		const node = currentNode.closest( '.sme-font-size' );
		if ( ! node ) {
			return undefined;
		}
		const CurrentSize = node.style.fontSize || undefined;
		return !! CurrentSize ? CurrentSize : undefined;
	};

	const getCurrentWeight = () => {
		const node = currentNode.closest( '.sme-font-size' );
		if ( ! node ) {
			return undefined;
		}
		const CurrentWeight = node.style.fontWeight || undefined;
		return !! CurrentWeight ? CurrentWeight : undefined;
	};

	const fontSizes = useSelect( ( select ) => select( 'core/block-editor' ).getSettings().fontSizes );
	const fontWeightsList = [
							{ value: '100', label: __( 'Thin 100', 'snow-monkey-editor' ) },
							{ value: '200', label: __( 'Extra-light 200', 'snow-monkey-editor' ) },
							{ value: '300', label: __( 'Light 300', 'snow-monkey-editor' ) },
							{ value: '400', label: __( 'Regular 400', 'snow-monkey-editor' ), },
							{ value: '500', label: __( 'Medium 500', 'snow-monkey-editor' ) },
							{ value: '600', label: __( 'Semi-Bold 600', 'snow-monkey-editor' ) },
							{ value: '700', label: __( 'Bold 700', 'snow-monkey-editor' ) },
							{ value: '800', label: __( 'Extra-Bold 800', 'snow-monkey-editor' ) },
							{ value: '900', label: __( 'Black 900', 'snow-monkey-editor' ) },
	];
	
	const BaseFontWeight = BaseFont.weight.split(',');
	let fontWeights = [];

	for(let v of BaseFontWeight) {
		let i = v / 100 - 1;
		fontWeights.push(fontWeightsList[i]);
	}

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
						value={ numbered( !! setting && setting.size ) || numbered( getCurrentSize() ) }
						onChange={ ( value ) => {
							const matched = find( fontSizes, [ 'size', value ] );
							const key = 'undefined' !== typeof matched ? matched.slug : 'custom';

							const newSize = {
								size: value,
								weight: getCurrentWeight(),
								class: `has-${ key }-font-size`,
							};
							setSetting( newSize );
							onChange( newSize );
						} }
					/>
				</BaseControl>
				<BaseControl
					id="snow-monkey-editor/format/font-size/popover"
					label={ __( 'Font weight', 'snow-monkey-editor' ) }
				>
					<SelectControl
						value={ ( !! setting && setting.weight ) || ( getCurrentWeight() ) }
						options={ fontWeights }
				        onChange={ ( value ) => {

							const newWeight = {
								size: numbered( getCurrentSize() ),
								weight: value,
							};
							setSetting( newWeight );
							onChange( newWeight );
						} }

					/>
				</BaseControl>
			</div>
		</Popover>
	);
}
