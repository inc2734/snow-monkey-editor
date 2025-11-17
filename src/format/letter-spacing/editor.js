import classnames from 'classnames';

import { Icon } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { default as InlineLetterSpacingUI } from '../component/inline-letter-spacing';
import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/letter-spacing';
const title = __( 'Letter spacing', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const [ isAddingLetterSpacing, setIsAddingLetterSpacing ] =
		useState( false );

	const openModal = useCallback( () => {
		setIsAddingLetterSpacing( true );
	}, [ setIsAddingLetterSpacing ] );

	const closeModal = useCallback( () => {
		setIsAddingLetterSpacing( false );
	}, [ setIsAddingLetterSpacing ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

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
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={ openModal }
				icon={ <Icon icon="controls-pause" /> }
			/>

			{ isAddingLetterSpacing && (
				<InlineLetterSpacingUI
					name={ name }
					title={ title }
					value={ value }
					onReset={ () => {
						onChange( removeFormat( value, name ) );
						closeModal();
					} }
					onChange={ ( newValue ) => {
						onChange(
							applyFormat( value, {
								type: name,
								attributes: {
									style: `letter-spacing: ${ newValue }rem`,
								},
							} )
						);
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
	className: 'sme-letter-spacing',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
