import classnames from 'classnames';

import { insertObject, useAnchor } from '@wordpress/rich-text';

import { Popover, ToggleControl } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';

const name = 'snow-monkey-editor/br';
const title = __( 'Line break per screen size', 'snow-monkey-editor' );

const DEFAULT_OBJECT_SETTINGS = {
	type: name,
	innerHTML: '<br />',
};

function InlineUI( { value, onChange, activeObjectAttributes, contentRef } ) {
	const className =
		value.replacements.slice()?.[ value.start ]?.attributes?.class;

	const isDisableDesktop = () =>
		!! className?.match( /sme-br--disable:desktop/ );
	const isDisableTablet = () =>
		!! className?.match( /sme-br--disable:tablet/ );
	const isDisableMobile = () =>
		!! className?.match( /sme-br--disable:mobile/ );

	const [ disableDesktop, setDisableDesktop ] = useState(
		isDisableDesktop()
	);
	const [ disableTablet, setDisableTablet ] = useState( isDisableTablet() );
	const [ disableMobile, setDisableMobile ] = useState( isDisableMobile() );

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const onChangeDesktop = useCallback(
		( newSetting ) => {
			setDisableDesktop( ! newSetting );

			const newReplacements = value.replacements.slice();

			newReplacements[ value.start ] = {
				...DEFAULT_OBJECT_SETTINGS,
				attributes: {
					...activeObjectAttributes,
					class: classnames( {
						'sme-br--disable:desktop': ! newSetting,
						'sme-br--disable:tablet': disableTablet,
						'sme-br--disable:mobile': disableMobile,
					} ),
				},
			};

			onChange( {
				...value,
				replacements: newReplacements,
			} );
		},
		[ disableTablet, disableMobile ]
	);

	const onChangeTablet = useCallback(
		( newSetting ) => {
			setDisableTablet( ! newSetting );

			const newReplacements = value.replacements.slice();

			newReplacements[ value.start ] = {
				...DEFAULT_OBJECT_SETTINGS,
				attributes: {
					...activeObjectAttributes,
					class: classnames( {
						'sme-br--disable:desktop': disableDesktop,
						'sme-br--disable:tablet': ! newSetting,
						'sme-br--disable:mobile': disableMobile,
					} ),
				},
			};

			onChange( {
				...value,
				replacements: newReplacements,
			} );
		},
		[ disableDesktop, disableMobile ]
	);

	const onChangeMobile = useCallback(
		( newSetting ) => {
			setDisableMobile( ! newSetting );

			const newReplacements = value.replacements.slice();

			newReplacements[ value.start ] = {
				...DEFAULT_OBJECT_SETTINGS,
				attributes: {
					...activeObjectAttributes,
					class: classnames( {
						'sme-br--disable:desktop': disableDesktop,
						'sme-br--disable:tablet': disableTablet,
						'sme-br--disable:mobile': ! newSetting,
					} ),
				},
			};

			onChange( {
				...value,
				replacements: newReplacements,
			} );
		},
		[ disableDesktop, disableTablet ]
	);

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="sme-popover"
		>
			<div
				style={ {
					width: '260px',
				} }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Line breaks when on the desktop',
						'snow-monkey-editor'
					) }
					checked={ ! disableDesktop }
					onChange={ onChangeDesktop }
					disabled={ disableTablet && disableMobile }
				/>

				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Line breaks when on the tablet',
						'snow-monkey-editor'
					) }
					checked={ ! disableTablet }
					onChange={ onChangeTablet }
					disabled={ disableDesktop && disableMobile }
				/>

				<ToggleControl
					__nextHasNoMarginBottom
					label={ __(
						'Line breaks when on the mobile',
						'snow-monkey-editor'
					) }
					checked={ ! disableMobile }
					onChange={ onChangeMobile }
					disabled={ disableDesktop && disableTablet }
				/>
			</div>
		</Popover>
	);
}

function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	return (
		<>
			<SnowMonkeyToolbarButton
				icon={
					<span className="dashicon">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M18.0224 5.25C18.4366 5.25 18.7724 5.58579 18.7724 6V15C18.7724 15.4142 18.4366 15.75 18.0224 15.75L18.0112 15.7499L18 15.75H10.0784V19L4.5 14.8349L10.0784 10.6699V14.25H17.2724V6C17.2724 5.58579 17.6082 5.25 18.0224 5.25Z"
								fill="currentColor"
							/>
						</svg>
					</span>
				}
				title={ title }
				onClick={ () => {
					const newValue = insertObject(
						value,
						{
							...DEFAULT_OBJECT_SETTINGS,
						},
						value.end,
						value.end
					);
					newValue.start = newValue.end - 1;
					onChange( newValue );

					onFocus();
				} }
				isActive={ isObjectActive }
			/>

			{ isObjectActive && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'sme-br',
	attributes: {
		class: 'class',
	},
	interactive: true,
	contentEditable: false,
	edit: Edit,
};
