import { get, find, isNumber, isString } from 'lodash';

import {
	FontSizePicker as BaseFontSizePicker,
	getFontSizeClass,
} from '@wordpress/block-editor';

import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';

import { withSpokenMessages, Popover, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function getActiveFontSize( formatName, formatValue, fontSizes ) {
	const activeFontSizeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFontSizeFormat ) {
		return;
	}
	const styleFontSize = activeFontSizeFormat.attributes.style;
	if ( styleFontSize ) {
		return styleFontSize.replace( new RegExp( `^font-size:\\s*` ), '' );
	}
	const currentClass = activeFontSizeFormat.attributes.class;
	if ( currentClass ) {
		const fontSizeSlug = currentClass.replace(
			/.*has-([^\s]*)-font-size.*/,
			'$1'
		);
		const fontSizeObject = find( fontSizes, { slug: fontSizeSlug } );
		if ( ! fontSizeObject ) {
			return;
		}
		return fontSizeObject.size;
	}
}

const FontSizePicker = ( { name, value, onChange, onClose } ) => {
	const fontSizes = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'fontSizes' ], [] );
	} );

	const onFontSizeChange = useCallback(
		( fontSize ) => {
			if ( !! fontSize ) {
				const hasUnits =
					isString( fontSize ) ||
					( fontSizes[ 0 ] && isString( fontSizes[ 0 ].size ) );

				let newFontSize;
				if ( hasUnits ) {
					newFontSize = fontSize;
				} else if ( isNumber( fontSize ) ) {
					newFontSize = `${ fontSize }px`;
				} else {
					return;
				}

				const fontSizeObject = find( fontSizes, {
					size: fontSize,
				} );

				onChange(
					applyFormat( value, {
						type: name,
						attributes: fontSizeObject
							? {
									class: getFontSizeClass(
										fontSizeObject.slug
									),
							  }
							: {
									style: `font-size: ${ newFontSize }`,
							  },
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ fontSizes, onChange ]
	);

	const activeFontSize = useMemo(
		() => getActiveFontSize( name, value, fontSizes ),
		[ name, value ]
	);

	return (
		<>
			<BaseFontSizePicker
				value={ activeFontSize }
				onChange={ onFontSizeChange }
				fontSizes={ fontSizes }
			/>

			<Button
				disabled={ value === undefined }
				variant="secondary"
				isSmall
				onClick={ () => {
					onChange( removeFormat( value, name ) );
					onClose();
				} }
			>
				{ __( 'Reset' ) }
			</Button>
		</>
	);
};

const InlineFontSizeUI = ( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	settings,
} ) => {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		value,
		settings,
	} );

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="sme-popover sme-popover--inline-font-size components-inline-color-popover"
		>
			<fieldset>
				<FontSizePicker
					name={ name }
					value={ value }
					onChange={ onChange }
					onClose={ onClose }
				/>
			</fieldset>
		</Popover>
	);
};

export default withSpokenMessages( InlineFontSizeUI );
