import { isEmpty, find, isNumber } from 'lodash';

import {
	applyFormat,
	getActiveFormat,
	removeFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineFontSizeUI } from './inline';

const name = 'snow-monkey-editor/font-size';
const title = __( 'Font size', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, isActive, onChange } = props;

	const { fontSizes, disableCustomFontSizes } = useSelect( ( select ) => {
		const blockEditorSelect = select( 'core/block-editor' );

		let settings;

		if ( blockEditorSelect && blockEditorSelect.getSettings ) {
			settings = blockEditorSelect.getSettings();
		} else {
			settings = {};
		}

		return {
			fontSizes: settings.fontSizes,
			disableCustomFontSizes: settings.disableCustomFontSizes,
		};
	} );

	const [ isAddingFontSize, setIsAddingFontSize ] = useState( false );

	const enableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( true ),
		[ setIsAddingFontSize ]
	);

	const disableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( false ),
		[ setIsAddingFontSize ]
	);

	const onFontSizeChange = useCallback(
		( size ) => {
			if ( size ) {
				const fontSize = find( fontSizes, [ 'size', size ] );
				const slug = !! fontSize ? fontSize.slug : 'custom';
				const sizeWithUnit = isNumber( size ) ? `${ size }px` : size;

				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: ! fontSize
								? `font-size: ${ sizeWithUnit }`
								: '',
							className: `has-${ slug }-font-size`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ fontSizes, onChange ]
	);

	const getActiveFontSize = ( formatName, formatValue ) => {
		const activeFontSizeFormat = getActiveFormat( formatValue, formatName );
		if ( ! activeFontSizeFormat ) {
			return;
		}

		const className = activeFontSizeFormat.attributes.className;
		const style = activeFontSizeFormat?.attributes?.style;

		if ( 'has-custom-font-size' !== className ) {
			const matched = className.match( /has-(.*?)-font-size/ );
			if ( matched ) {
				const slug = matched[ 1 ];
				const fontSize = find( fontSizes, [ 'slug', slug ] );
				return !! fontSize ? fontSize.size : undefined;
			}
		}

		const matched = style.match( /font-size:\s([0-9A-Za-z]*)/ );
		return !! matched ? matched[ 1 ] : undefined;
	};

	const hasFontSizesToChoose =
		! isEmpty( fontSizes ) || disableCustomFontSizes !== true;
	if ( ! hasFontSizesToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<SnowMonkeyToolbarButton
				key={ isActive ? 'sme-font-size' : 'sme-font-size-not-active' }
				name={ isActive ? 'sme-font-size' : undefined }
				title={ title }
				className="format-library-text-color-button sme-toolbar-button"
				onClick={
					hasFontSizesToChoose
						? enableIsAddingFontSize
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="editor-textcolor" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator sme-toolbar-button__indicator"
								style={ { backgroundColor: '#cd162c' } }
							/>
						) }
					</>
				}
			/>

			{ isAddingFontSize && (
				<InlineFontSizeUI
					name={ name }
					addingFontSize={ isAddingFontSize }
					onClose={ disableIsAddingFontSize }
					value={ value }
					onFontSizeChange={ onFontSizeChange }
					getActiveFontSize={ getActiveFontSize }
					fontSizes={ fontSizes }
				/>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-font-size',
	attributes: {
		style: 'style',
		className: 'class',
	},
	edit: Edit,
};
