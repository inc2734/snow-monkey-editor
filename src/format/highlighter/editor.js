import classnames from 'classnames';
import hexToRgba from 'hex-to-rgba';

import { useSetting } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import {
	default as InlineColorUI,
	getActiveColor,
} from '../component/inline-gradient';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/highlighter';
const title = __( 'Highlighter', 'snow-monkey-editor' );

const EMPTY_ARRAY = [];

const Edit = ( props ) => {
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

	const colors = useSetting( 'color.palette' ) || EMPTY_ARRAY;
	const [ isAddingColor, setIsAddingColor ] = useState( false );

	const activeColor = useMemo( () => {
		return getActiveColor( name, value, colors );
	}, [ value, colors ] );

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
				onClick={ () => {
					setIsAddingColor( ! isAddingColor );
				} }
				icon={ <Icon icon="tag" /> }
			/>

			{ isAddingColor && (
				<InlineColorUI
					name={ name }
					activeAttributes={ activeAttributes }
					value={ value }
					onClose={ () => setIsAddingColor( false ) }
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
							setIsAddingColor( false );
						}
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
	className: 'sme-highlighter',
	attributes: {
		style: 'style',
	},
	edit: Edit,
};
