import classnames from 'classnames';
import { find, isNumber, isString } from 'lodash';

import { useSettings, getFontSizeClass } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { default as InlineFontSizeUI } from '../component/inline-font-size';
import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/font-size';
const title = __( 'Font size', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const [ isAddingFontSize, setIsAddingFontSize ] = useState( false );

	const openModal = useCallback( () => {
		setIsAddingFontSize( true );
	}, [ setIsAddingFontSize ] );

	const closeModal = useCallback( () => {
		setIsAddingFontSize( false );
	}, [ setIsAddingFontSize ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	return (
		<>
			<SnowMonkeyToolbarButton
				key={ isActive ? 'sme-font-size' : 'sme-font-size-not-active' }
				name={ isActive ? 'sme-font-size' : undefined }
				title={ title }
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={ openModal }
				icon={ <Icon icon="editor-textcolor" /> }
			/>

			{ isAddingFontSize && (
				<InlineFontSizeUI
					name={ name }
					value={ value }
					onReset={ () => {
						onChange( removeFormat( value, name ) );
						closeModal();
					} }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							const hasUnits =
								isString( newValue ) ||
								( fontSizes[ 0 ] &&
									isString( fontSizes[ 0 ].size ) );

							let newFontSize;
							if ( hasUnits ) {
								newFontSize = newValue;
							} else if ( isNumber( newValue ) ) {
								newFontSize = `${ newValue }px`;
							} else {
								return;
							}

							const fontSizeObject = find( fontSizes, {
								size: newValue,
							} );

							onChange(
								applyFormat( value, {
									type: name,
									attributes: fontSizeObject
										? {
												class: getFontSizeClass(
													fontSizeObject.slug
												),
										  }
										: {
												style: `font-size: ${ newFontSize }`,
										  },
								} )
							);
						} else {
							onChange( removeFormat( value, name ) );
							closeModal();
						}
					} }
					contentRef={ contentRef }
					settings={ { ...settings, isActive } }
					onClose={ closeModal }
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
