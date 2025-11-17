import classnames from 'classnames';
import hexToRgba from 'hex-to-rgba';

import { store as blockEditorStore } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import {
	default as InlineColorUI,
	getActiveColor,
} from '../component/inline-highlighter';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/highlighter';
const title = __( 'Highlighter', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const colors = useSelect(
		( select ) => select( blockEditorStore ).getSettings()?.colors ?? [],
		[]
	);

	const activeColor = useMemo(
		() => getActiveColor( name, value, colors ),
		[ value, colors ]
	);

	const [ isAddingColor, setIsAddingColor ] = useState( false );

	const openModal = useCallback( () => {
		setIsAddingColor( true );
	}, [ setIsAddingColor ] );

	const closeModal = useCallback( () => {
		setIsAddingColor( false );
	}, [ setIsAddingColor ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	return (
		<>
			<SnowMonkeyToolbarButton
				key={
					isActive ? 'sme-highlighter' : 'sme-highlighter-not-active'
				}
				name={ isActive ? 'sme-highlighter' : undefined }
				title={ title }
				style={ { color: activeColor } }
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={ openModal }
				icon={ <Icon icon="tag" /> }
			/>

			{ isAddingColor && (
				<InlineColorUI
					name={ name }
					value={ value }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							if ( newValue.match( /^#/ ) ) {
								newValue = hexToRgba( newValue, 0.5 );
							}

							onChange(
								applyFormat( value, {
									type: name,
									attributes: {
										style: `background-image: linear-gradient(transparent 60%, ${ newValue } 60%)`,
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
	className: 'sme-highlighter',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
