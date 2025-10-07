import classnames from 'classnames';

import {
	getColorClassName,
	getColorObjectByColorValue,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import {
	default as InlineColorUI,
	getActiveBackgroundColor,
} from '../component/inline-background-color';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/bg-color';
const title = __( 'Background color', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const colors = useSelect(
		( select ) => select( blockEditorStore ).getSettings()?.colors ?? [],
		[]
	);

	const activeColor = useMemo(
		() => getActiveBackgroundColor( name, value, colors ),
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
				key={ isActive ? 'sme-bg-color' : 'sme-bg-color-not-active' }
				name={ isActive ? 'sme-bg-color' : undefined }
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
													'background-color',
													colorObject.slug
												),
										  }
										: {
												style: `background-color: ${ newValue }`,
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
