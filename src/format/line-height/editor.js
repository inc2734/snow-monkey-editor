import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineLineHeightUI } from '../component/inline-line-height';

const name = 'snow-monkey-editor/line-height';
const title = __( 'Line height', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

	const [ isAddingLineHeight, setIsAddingLineHeight ] = useState( false );

	const enableIsAddingLineHeight = useCallback(
		() => setIsAddingLineHeight( true ),
		[ setIsAddingLineHeight ]
	);

	const disableIsAddingLineHeight = useCallback(
		() => setIsAddingLineHeight( false ),
		[ setIsAddingLineHeight ]
	);

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
					title={ title }
					onClose={ disableIsAddingLineHeight }
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
	className: 'sme-line-height',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
