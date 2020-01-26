'use strict';

import {
	ColorPalette,
} from '@wordpress/block-editor';

import {
	Button,
	ColorPicker,
	withFocusReturn,
	Popover,
} from '@wordpress/components';

import {
	useState,
} from '@wordpress/element';

import {
	useSelect,
} from '@wordpress/data';

import {
	__,
} from '@wordpress/i18n';

export default function( { ...props } ) {
	const [ useCustomColors, setUseCustomColors ] = useState( false );

	const settings = useSelect( ( select ) => select( 'core/block-editor' ).getSettings() );
	const disableCustomColors = settings.disableCustomColors;

	const ButtonWithFocusReturn = withFocusReturn(
		() => (
			<Button
				className="sme-custom-colors-link"
				isLink
				value={ useCustomColors }
				onClick={ () => setUseCustomColors( ! useCustomColors ) }
			>
				{ __( 'Custom colors', 'snow-monkey-editor' ) }
			</Button>
		)
	);

	const openedCustomColorsLink = document.querySelector( '.sme-custom-colors-link' );
	const anchorRect = openedCustomColorsLink ? openedCustomColorsLink.getBoundingClientRect() : undefined;

	return (
		<>
			<ColorPalette
				value={ props.value }
				onChange={ props.onChange }
				disableCustomColors={ true }
			/>

			<ButtonWithFocusReturn />

			{ ! disableCustomColors && useCustomColors &&
				<Popover
					className="sme-popover"
					focusOnMount={ false }
					anchorRect={ anchorRect }
					position="left top"
				>
					<ColorPicker
						color={ props.value }
						onChangeComplete={ props.onChange }
						disableAlpha={ props.disableAlpha }
					/>
				</Popover>
			}
		</>
	);
}
