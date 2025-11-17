import classnames from 'classnames';

import {
	getGradientSlugByValue,
	__experimentalGetGradientClass,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { removeFormat, applyFormat } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import {
	default as InlineGradientUI,
	getActiveGradient,
} from '../component/inline-gradient';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/text-gradient';
const title = __( 'Text gradient', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive, contentRef } = props;

	const gradients = useSelect(
		( select ) => select( blockEditorStore ).getSettings()?.gradients ?? [],
		[]
	);

	const activeGradient = useMemo( () => {
		return getActiveGradient( name, value, gradients );
	}, [ value, gradients ] );

	const [ isAddingGradient, setIsAddingGradient ] = useState( false );

	const openModal = useCallback( () => {
		setIsAddingGradient( true );
	}, [ setIsAddingGradient ] );

	const closeModal = useCallback( () => {
		setIsAddingGradient( false );
	}, [ setIsAddingGradient ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	return (
		<>
			<SnowMonkeyToolbarButton
				key={
					isActive
						? 'sme-text-gradient'
						: 'sme-text-gradient-not-active'
				}
				name={ isActive ? 'sme-text-gradient' : undefined }
				title={ title }
				style={ { '--sme--gradient': activeGradient } }
				className={ classnames(
					'sme-toolbar-button',
					'sme-toolbar-button--text-gradient',
					{
						'is-pressed': !! isActive,
					}
				) }
				onClick={ openModal }
				icon={ <Icon icon="edit" /> }
			/>

			{ isAddingGradient && (
				<InlineGradientUI
					name={ name }
					value={ value }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							const gradientObject = getGradientSlugByValue(
								gradients,
								newValue
							);

							onChange(
								applyFormat( value, {
									type: name,
									attributes: gradientObject
										? {
												class: __experimentalGetGradientClass(
													gradientObject
												),
										  }
										: {
												style: `background-image: ${ newValue }`,
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
	className: 'sme-text-gradient',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};
