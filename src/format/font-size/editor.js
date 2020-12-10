import { isEmpty, find } from 'lodash';

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
		( fontSize ) => {
			if ( fontSize ) {
				const matched = find( fontSizes, [ 'size', fontSize ] );
				const slug = !! matched ? matched.slug : 'custom';

				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `font-size: ${ fontSize }px`,
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

		const styleFontSize = activeFontSizeFormat.attributes.style;
		if ( styleFontSize ) {
			return styleFontSize
				.replace( new RegExp( `^font-size:\\s*` ), '' )
				.replace( 'px', '' );
		}
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
