import { find } from 'lodash';

import {
	FontSizePicker as BaseFontSizePicker,
	useSettings,
} from '@wordpress/block-editor';

import { getActiveFormat, useAnchor } from '@wordpress/rich-text';
import { Popover, Button } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
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
		let fontSizeSlug = currentClass.replace(
			/.*has-([^\s]*)-font-size.*/,
			'$1'
		);
		let fontSizeObject = find( fontSizes, { slug: fontSizeSlug } );
		if ( ! fontSizeObject ) {
			fontSizeSlug = fontSizeSlug.replace(
				/(\d)-([^\d])/,
				'$1$2',
				fontSizeSlug
			);
			fontSizeObject = find( fontSizes, { slug: fontSizeSlug } );
			if ( ! fontSizeObject ) {
				return;
			}
		}
		return fontSizeObject.size;
	}
}

const FontSizePicker = ( { name, value, onChange, onReset } ) => {
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );

	const activeFontSize = useMemo(
		() => getActiveFontSize( name, value, fontSizes ),
		[ name, value ]
	);

	return (
		<>
			<BaseFontSizePicker
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				value={ activeFontSize }
				onChange={ onChange }
				fontSizes={ fontSizes }
			/>

			<Button
				disabled={ value === undefined }
				variant="secondary"
				size="small"
				onClick={ onReset }
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
	onReset,
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
			className="sme-popover sme-popover--inline-font-size components-inline-color-popover"
		>
			<fieldset>
				<FontSizePicker
					name={ name }
					value={ value }
					onChange={ onChange }
					onReset={ onReset }
				/>
			</fieldset>
		</Popover>
	);
};

export default InlineFontSizeUI;
