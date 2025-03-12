import { find } from 'lodash';

import {
	useSettings,
	useCachedTruthy,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';

import { withSpokenMessages, Popover } from '@wordpress/components';
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
	const [ userGradients, themeGradients, defaultGradients ] = useSettings(
		'color.gradients.custom',
		'color.gradients.theme',
		'color.gradients.default'
	);

	const gradients = useMemo(
		() => [
			...( userGradients || [] ),
			...( themeGradients || [] ),
			...( defaultGradients || [] ),
		],
		[ userGradients, themeGradients, defaultGradients ]
	);

	const activeGradient = useMemo(
		() => getActiveGradient( name, value, gradients ),
		[ name, value, gradients ]
	);

	return (
		<ColorGradientControl
			label={ __( 'Color', 'snow-monkey-editor' ) }
			gradientValue={ activeGradient }
			onGradientChange={ onChange }
			{ ...useMultipleOriginColorsAndGradients() }
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

	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	return (
		<Popover
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

export default withSpokenMessages( InlineGradientUI );
