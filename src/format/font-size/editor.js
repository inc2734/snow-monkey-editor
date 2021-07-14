import { isEmpty } from 'lodash';

import { useSetting } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineFontSizeUI } from '../component/inline-font-size';

const name = 'snow-monkey-editor/font-size';
const title = __( 'Font size', 'snow-monkey-editor' );

const EMPTY_ARRAY = [];

const Edit = ( props ) => {
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

	const allowCustomControl = useSetting( 'typography.customFontSize', name );
	const fontSizes = useSetting( 'typography.fontSizes' ) || EMPTY_ARRAY;
	const [ isAddingFontSize, setIsAddingFontSize ] = useState( false );
	const enableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( true ),
		[ setIsAddingFontSize ]
	);
	const disableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( false ),
		[ setIsAddingFontSize ]
	);

	const hasFontSizesToChoose = ! isEmpty( fontSizes ) || ! allowCustomControl;
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
					onClose={ disableIsAddingFontSize }
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
	className: 'sme-font-size',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};
