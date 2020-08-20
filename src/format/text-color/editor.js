import { get, isEmpty } from 'lodash';

import {
	applyFormat,
	getActiveFormat,
	removeFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyEditorButton } from '../component/snow-monkey-editor-button';
import { default as InlineColorUI } from '../component/inline';

export const name = 'snow-monkey-editor/text-color';
const title = __( 'Text color', 'snow-monkey-editor' );

const EMPTY_ARRAY = [];

const Edit = ( props ) => {
	const { value, onChange, isActive } = props;

	const { colors, disableCustomColors } = useSelect( ( select ) => {
		const blockEditorSelect = select( 'core/block-editor' );

		let settings;

		if ( blockEditorSelect && blockEditorSelect.getSettings ) {
			settings = blockEditorSelect.getSettings();
		} else {
			settings = {};
		}

		return {
			colors: get( settings, [ 'colors' ], EMPTY_ARRAY ),
			disableCustomColors: settings.disableCustomColors,
		};
	} );

	const [ isAddingColor, setIsAddingColor ] = useState( false );

	const enableIsAddingColor = useCallback( () => setIsAddingColor( true ), [
		setIsAddingColor,
	] );

	const disableIsAddingColor = useCallback( () => setIsAddingColor( false ), [
		setIsAddingColor,
	] );

	const onColorChange = useCallback(
		( color ) => {
			if ( color ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `color: ${ color }`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ colors, onChange ]
	);

	const getActiveColor = ( formatName, formatValue ) => {
		const activeColorFormat = getActiveFormat( formatValue, formatName );
		if ( ! activeColorFormat ) {
			return;
		}

		const styleColor = activeColorFormat.attributes.style;
		if ( styleColor ) {
			return styleColor.replace( new RegExp( `^color:\\s*` ), '' );
		}
	};

	const colorIndicatorStyle = useMemo( () => {
		const activeColor = getActiveColor( name, value, colors );
		if ( ! activeColor ) {
			return undefined;
		}

		return {
			backgroundColor: activeColor,
		};
	}, [ value, colors ] );

	const hasColorsToChoose =
		! isEmpty( colors ) || disableCustomColors !== true;
	if ( ! hasColorsToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<SnowMonkeyEditorButton
				key={
					isActive ? 'sme-text-color' : 'sme-text-color-not-active'
				}
				name={ isActive ? 'sme-text-color' : undefined }
				title={ title }
				className="format-library-text-color-button"
				onClick={
					hasColorsToChoose
						? enableIsAddingColor
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="edit" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator"
								style={ colorIndicatorStyle }
							/>
						) }
					</>
				}
			/>

			{ isAddingColor && (
				<InlineColorUI
					name={ name }
					addingColor={ isAddingColor }
					onClose={ disableIsAddingColor }
					isActive={ isActive }
					value={ value }
					onColorChange={ onColorChange }
					getActiveColor={ getActiveColor }
				/>
			) }
		</>
	);
};

export const settings = {
	title,
	tagName: 'span',
	className: 'sme-text-color',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
