import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineLetterSpacingUI } from '../component/inline-letter-spacing';

const name = 'snow-monkey-editor/letter-spacing';
const title = __( 'Letter spacing', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

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
					title={ title }
					onClose={ disableIsAddingLetterSpacing }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ ( ...args ) => {
						onChange( ...args );
					} }
					contentRef={ contentRef }
					settings={ settings }
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
	},
	edit: Edit,
};
