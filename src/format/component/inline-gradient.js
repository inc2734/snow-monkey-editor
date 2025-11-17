import { find } from 'lodash';

import {
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';
import { Popover } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function getActiveGradient( formatName, formatValue, gradients ) {
	const activeColorFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeColorFormat ) {
		return;
	}

	const currentStyle = activeColorFormat.attributes?.style;
	if ( currentStyle ) {
		return currentStyle.replace(
			new RegExp( `^background-image:\\s*` ),
			''
		);
	}
	const currentClass = activeColorFormat.attributes?.class;
	if ( currentClass ) {
		let gradientSlug = currentClass.replace(
			/.*has-([^\s]*)-gradient-background.*/,
			'$1'
		);
		let gradientObject = find( gradients, { slug: gradientSlug } );
		if ( ! gradientObject ) {
			gradientSlug = gradientSlug.replace(
				/(\d)-([^\d])/,
				'$1$2',
				gradientSlug
			);
			gradientObject = find( gradients, { slug: gradientSlug } );
			if ( ! gradientObject ) {
				return;
			}
		}
		return gradientObject.gradient;
	}
}

const GradientPicker = ( { name, value, onChange } ) => {
	const multipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradients();

	const gradients = useMemo( () => {
		const origins = multipleOriginColorsAndGradients?.gradients ?? [];

		if ( Array.isArray( origins ) ) {
			return origins.reduce( ( acc, origin ) => {
				if ( Array.isArray( origin?.gradients ) ) {
					return [ ...acc, ...origin.gradients ];
				}

				if ( origin?.gradient ) {
					return [ ...acc, origin ];
				}

				return acc;
			}, [] );
		}

		return origins;
	}, [ multipleOriginColorsAndGradients?.gradients ] );

	const activeGradient = useMemo(
		() => getActiveGradient( name, value, gradients ),
		[ name, value, gradients ]
	);

	return (
		<ColorGradientControl
			label={ __( 'Color', 'snow-monkey-editor' ) }
			gradientValue={ activeGradient }
			onGradientChange={ onChange }
			{ ...multipleOriginColorsAndGradients }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
};

const InlineGradientUI = ( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	settings,
} ) => {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount="firstElement"
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-gradient components-inline-gradient-popover"
		>
			<GradientPicker
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
		</Popover>
	);
};

export default InlineGradientUI;
