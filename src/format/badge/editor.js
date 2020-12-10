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

const name = 'snow-monkey-editor/badge';
const title = __( 'Badge', 'snow-monkey-editor' );

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
							style: `background-color: ${ color }`,
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
			return styleColor.replace(
				new RegExp( `^background-color:\\s*` ),
				''
			);
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
				key={ isActive ? 'sme-badge' : 'sme-badge-not-active' }
				name={ isActive ? 'sme-badge' : undefined }
				title={ title }
				className="format-library-text-color-button sme-toolbar-button"
				onClick={
					hasColorsToChoose
						? enableIsAddingColor
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="tag" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator sme-toolbar-button__indicator"
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
	className: 'sme-badge',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
