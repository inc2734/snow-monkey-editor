import classnames from 'classnames';
import { isEmpty } from 'lodash';

import { useSetting } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import {
	default as InlineColorUI,
	getActiveBackgroundColor,
} from '../component/inline-background-color';

const name = 'snow-monkey-editor/bg-color';
const title = __( 'Background color', 'snow-monkey-editor' );

const EMPTY_ARRAY = [];

const Edit = ( props ) => {
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

	const allowCustomControl = useSetting( 'color.custom' );
	const colors = useSetting( 'color.palette' ) || EMPTY_ARRAY;
	const [ isAddingColor, setIsAddingColor ] = useState( false );
	const enableIsAddingColor = useCallback( () => setIsAddingColor( true ), [
		setIsAddingColor,
	] );
	const disableIsAddingColor = useCallback( () => setIsAddingColor( false ), [
		setIsAddingColor,
	] );
	const activeColor = useMemo( () => {
		return getActiveBackgroundColor( name, value, colors );
	}, [ value, colors ] );

	const hasColorsToChoose = ! isEmpty( colors ) || ! allowCustomControl;
	if ( ! hasColorsToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<SnowMonkeyToolbarButton
				key={ isActive ? 'sme-bg-color' : 'sme-bg-color-not-active' }
				name={ isActive ? 'sme-bg-color' : undefined }
				title={ title }
				style={ { color: activeColor } }
				className={ classnames( 'sme-toolbar-button', {
					'is-pressed': !! isActive,
				} ) }
				onClick={
					hasColorsToChoose
						? enableIsAddingColor
						: () => onChange( removeFormat( value, name ) )
				}
				icon={ <Icon icon="tag" /> }
			/>

			{ isAddingColor && (
				<InlineColorUI
					name={ name }
					onClose={ disableIsAddingColor }
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
	className: 'sme-bg-color',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};
