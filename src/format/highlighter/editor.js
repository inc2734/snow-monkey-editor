import rgb2hex from 'rgb2hex';
import hexToRgba from 'hex-to-rgba';

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

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineColorUI } from '../component/inline';
import hexLong2Short from '../helper/hex-long2short';

const name = 'snow-monkey-editor/highlighter';
const title = __( 'Highlighter', 'snow-monkey-editor' );

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
							style: `background-image: linear-gradient(transparent 60%, ${ hexToRgba(
								color,
								0.5
							) } 60%)`,
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
			<SnowMonkeyToolbarButton
				key={
					isActive ? 'sme-highlighter' : 'sme-highlighter-not-active'
				}
				name={ isActive ? 'sme-highlighter' : undefined }
				title={ title }
				className="format-library-text-color-button"
				onClick={
					hasColorsToChoose
						? enableIsAddingColor
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="admin-customizer" />
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
					value={ value }
					onColorChange={ onColorChange }
					getActiveColor={ getActiveColor }
				/>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-highlighter',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
