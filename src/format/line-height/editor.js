import {
	applyFormat,
	getActiveFormat,
	removeFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineLineHeightUI } from './inline';

const name = 'snow-monkey-editor/line-height';
const title = __( 'Line height', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, isActive, onChange } = props;

	const [ isAddingLineHeight, setIsAddingLineHeight ] = useState( false );

	const enableIsAddingLineHeight = useCallback(
		() => setIsAddingLineHeight( true ),
		[ setIsAddingLineHeight ]
	);

	const disableIsAddingLineHeight = useCallback(
		() => setIsAddingLineHeight( false ),
		[ setIsAddingLineHeight ]
	);

	const onLineHeightChange = useCallback(
		( lineHeight ) => {
			if ( lineHeight ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `line-height: ${ lineHeight }`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
				disableIsAddingLineHeight();
			}
		},
		[ onChange ]
	);

	const getActiveLineHeight = ( formatName, formatValue ) => {
		const activeLineHeightFormat = getActiveFormat(
			formatValue,
			formatName
		);
		if ( ! activeLineHeightFormat ) {
			return;
		}

		const styleLineHeight = activeLineHeightFormat.attributes.style;
		if ( styleLineHeight ) {
			return parseFloat(
				styleLineHeight.replace( new RegExp( `^line-height:\\s*` ), '' )
			);
		}
	};

	const hasLineHeightToChoose = true;
	if ( ! hasLineHeightToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<SnowMonkeyToolbarButton
				key={
					isActive ? 'sme-line-height' : 'sme-line-height-not-active'
				}
				name={ isActive ? 'sme-line-height' : undefined }
				title={ title }
				className="format-library-text-color-button sme-toolbar-button"
				onClick={
					hasLineHeightToChoose
						? enableIsAddingLineHeight
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="editor-insertmore" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator sme-toolbar-button__indicator"
								style={ { backgroundColor: '#cd162c' } }
							/>
						) }
					</>
				}
			/>

			{ isAddingLineHeight && (
				<InlineLineHeightUI
					name={ name }
					addingLineHeight={ isAddingLineHeight }
					onClose={ disableIsAddingLineHeight }
					value={ value }
					onLineHeightChange={ onLineHeightChange }
					getActiveLineHeight={ getActiveLineHeight }
				/>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-line-height',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
