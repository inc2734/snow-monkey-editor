import classnames from 'classnames';

import {
	useSetting,
	getColorClassName,
	getColorObjectByColorValue,
} from '@wordpress/block-editor';

import { Icon } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import {
	default as InlineColorUI,
	getActiveColor,
} from '../component/inline-color';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/text-color';
const title = __( 'Text color', 'snow-monkey-editor' );

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
					isActive ? 'sme-text-color' : 'sme-text-color-not-active'
				}
				name={ isActive ? 'sme-text-color' : undefined }
				title={ title }
				style={ { color: activeColor } }
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={ () => {
					setIsAddingColor( ! isAddingColor );
				} }
				icon={ <Icon icon="edit" /> }
			/>

			{ isAddingColor && (
				<InlineColorUI
					name={ name }
					activeAttributes={ activeAttributes }
					value={ value }
					onClose={ () => setIsAddingColor( false ) }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							const colorObject = getColorObjectByColorValue(
								colors,
								newValue
							);

							onChange(
								applyFormat( value, {
									type: name,
									attributes: colorObject
										? {
												class: getColorClassName(
													'color',
													colorObject.slug
												),
										  }
										: {
												style: `color: ${ newValue }`,
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
	className: 'sme-text-color',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};
