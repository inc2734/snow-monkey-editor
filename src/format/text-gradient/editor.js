import classnames from 'classnames';

import {
	useSettings,
	getGradientSlugByValue,
	__experimentalGetGradientClass,
} from '@wordpress/block-editor';

import { Icon } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
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
	const { value, onChange, isActive, activeAttributes, contentRef } = props;

	const [ userGradients, themeGradients, defaultGradients ] = useSettings(
		'color.gradients.custom',
		'color.gradients.theme',
		'color.gradients.default'
	);

	const gradients = useMemo(
		() => [
			...( userGradients || [] ),
			...( themeGradients || [] ),
			...( defaultGradients || [] ),
		],
		[ userGradients, themeGradients, defaultGradients ]
	);

	const [ isAddingGradient, setIsAddingGradient ] = useState( false );

	const activeGradient = useMemo( () => {
		return getActiveGradient( name, value, gradients );
	}, [ value, gradients ] );

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
				onClick={ () => {
					setIsAddingGradient( ! isAddingGradient );
				} }
				icon={ <Icon icon="edit" /> }
			/>

			{ isAddingGradient && (
				<InlineGradientUI
					name={ name }
					activeAttributes={ activeAttributes }
					value={ value }
					onClose={ () => setIsAddingGradient( false ) }
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
							setIsAddingGradient( false );
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
	className: 'sme-text-gradient',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};
