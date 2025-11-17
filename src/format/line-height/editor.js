import classnames from 'classnames';

import { Icon } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { default as InlineLineHeightUI } from '../component/inline-line-height';
import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/line-height';
const title = __( 'Line height', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const [ isAddingLineHeight, setIsAddingLineHeight ] = useState( false );

	const openModal = useCallback( () => {
		setIsAddingLineHeight( true );
	}, [ setIsAddingLineHeight ] );

	const closeModal = useCallback( () => {
		setIsAddingLineHeight( false );
	}, [ setIsAddingLineHeight ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	return (
		<>
			<SnowMonkeyToolbarButton
				key={
					isActive ? 'sme-line-height' : 'sme-line-height-not-active'
				}
				name={ isActive ? 'sme-line-height' : undefined }
				title={ title }
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={ openModal }
				icon={ <Icon icon="editor-insertmore" /> }
			/>

			{ isAddingLineHeight && (
				<InlineLineHeightUI
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
									style: `line-height: ${ newValue }`,
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
	className: 'sme-line-height',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
