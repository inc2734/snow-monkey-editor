import { get } from 'lodash';
import rgb2hex from 'rgb2hex';

import {
	useCachedTruthy,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';

import { withSpokenMessages, Popover } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import hexLong2Short from '../helper/hex-long2short';

export function getActiveColor( formatName, formatValue ) {
	const activeColorFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeColorFormat ) {
		return;
	}

	const styleColor = activeColorFormat.attributes.style;
	if ( ! styleColor ) {
		return;
	}

	const hex = styleColor.match( /(#[0-9A-F]{3,6}) /i );
	if ( hex ) {
		return hex;
	}

	const rgb = styleColor.match( /,\s*?(rgba?\([^)]+\)) /i );
	if ( rgb ) {
		return hexLong2Short( rgb2hex( rgb[ 1 ] ).hex );
	}
}

const ColorPicker = ( { name, value, onChange } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const activeColor = useMemo(
		() => getActiveColor( name, value, colors ),
		[ name, value, colors ]
	);

	return (
		<ColorGradientControl
			label={ __( 'Color', 'snow-monkey-editor' ) }
			colorValue={ activeColor }
			onColorChange={ onChange }
			{ ...useMultipleOriginColorsAndGradients() }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
};

const InlineColorUI = ( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	settings,
} ) => {
	const popoverAnchor = useCachedTruthy(
		useAnchor( {
			editableContentElement: contentRef.current,
			value,
			settings,
		} )
	);

	const rect = useMemo( () => popoverAnchor.getBoundingClientRect(), [] );
	if ( !! popoverAnchor?.ownerDocument ) {
		popoverAnchor.getBoundingClientRect = () => rect;
	}

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-color components-inline-color-popover"
		>
			<ColorPicker name={ name } value={ value } onChange={ onChange } />
		</Popover>
	);
};

export default withSpokenMessages( InlineColorUI );
