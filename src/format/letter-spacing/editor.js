import {
	applyFormat,
	getActiveFormat,
	removeFormat,
} from '@wordpress/rich-text';

import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineLetterSpacingUI } from './inline';

const name = 'snow-monkey-editor/letter-spacing';
const title = __( 'Letter spacing', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, isActive, onChange } = props;

	const [ isAddingLetterSpacing, setIsAddingLetterSpacing ] = useState(
		false
	);

	const enableIsAddingLetterSpacing = useCallback(
		() => setIsAddingLetterSpacing( true ),
		[ setIsAddingLetterSpacing ]
	);

	const disableIsAddingLetterSpacing = useCallback(
		() => setIsAddingLetterSpacing( false ),
		[ setIsAddingLetterSpacing ]
	);

	const onLetterSpacingChange = useCallback(
		( letterSpacing ) => {
			if ( letterSpacing ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `letter-spacing: ${ letterSpacing }rem`,
						},
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
				disableIsAddingLetterSpacing();
			}
		},
		[ onChange ]
	);

	const getActiveLetterSpacing = ( formatName, formatValue ) => {
		const activeLetterSpacingFormat = getActiveFormat(
			formatValue,
			formatName
		);
		if ( ! activeLetterSpacingFormat ) {
			return;
		}

		const styleLetterSpacing = activeLetterSpacingFormat.attributes.style;
		if ( styleLetterSpacing ) {
			return parseFloat(
				styleLetterSpacing
					.replace( new RegExp( `^letter-spacing:\\s*` ), '' )
					.replace( 'rem', '' )
			);
		}
	};

	const hasLetterSpacingsToChoose = true;
	if ( ! hasLetterSpacingsToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<SnowMonkeyToolbarButton
				key={
					isActive
						? 'sme-letter-spacing'
						: 'sme-letter-spacing-not-active'
				}
				name={ isActive ? 'sme-letter-spacing' : undefined }
				title={ title }
				className="format-library-text-color-button sme-toolbar-button"
				onClick={
					hasLetterSpacingsToChoose
						? enableIsAddingLetterSpacing
						: () => onChange( removeFormat( value, name ) )
				}
				icon={
					<>
						<Icon icon="controls-pause" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator sme-toolbar-button__indicator"
								style={ { backgroundColor: '#cd162c' } }
							/>
						) }
					</>
				}
			/>

			{ isAddingLetterSpacing && (
				<InlineLetterSpacingUI
					name={ name }
					addingLetterSpacing={ isAddingLetterSpacing }
					onClose={ disableIsAddingLetterSpacing }
					value={ value }
					onLetterSpacingChange={ onLetterSpacingChange }
					getActiveLetterSpacing={ getActiveLetterSpacing }
				/>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-letter-spacing',
	attributes: {
		style: 'style',
		className: 'class',
	},
	edit: Edit,
};
