import classnames from 'classnames';

import {
	Button,
	Dropdown,
	Icon,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	blockAttributes as hiddenBySizeBlockAttributes,
	settings as hiddenBySizeSettings,
} from './hidden-by-size/editor';

import {
	blockAttributes as hiddenByRoleBlockAttributes,
	settings as hiddenByRoleSettings,
} from './hidden-by-role/editor';

import {
	blockAttributes as animationBlockAttributes,
	settings as animationSettings,
} from './animation/editor';

import {
	blockAttributes as dateTimeBlockAttributes,
	publishSettings,
	unpublishSettings,
} from './date-time/editor';

import {
	blockAttributes as editingLockBlockAttributes,
	settings as editingLockSettings,
} from './editing-lock/editor';

import { icon } from '../helper/icon';

const settings = [
	hiddenBySizeSettings,
	hiddenByRoleSettings,
	animationSettings,
	publishSettings,
	unpublishSettings,
	editingLockSettings,
];

const addBlockAttributes = ( blockTypes ) => {
	blockTypes = hiddenBySizeBlockAttributes( blockTypes );
	blockTypes = hiddenByRoleBlockAttributes( blockTypes );
	blockTypes = animationBlockAttributes( blockTypes );
	blockTypes = dateTimeBlockAttributes( blockTypes );
	blockTypes = editingLockBlockAttributes( blockTypes );
	return blockTypes;
};

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const isExtensionsShown = settings.some( ( setting ) =>
			setting.isShown( props )
		);

		return (
			<>
				<BlockEdit { ...props } />

				{ isExtensionsShown && (
					<InspectorControls>
						<ToolsPanel
							label={ __(
								'Snow Monkey Editor',
								'snow-monkey-editor'
							) }
							resetAll={ () => {
								settings.forEach( ( setting ) =>
									setting.resetValue( props )
								);
							} }
							className="color-block-support-panel sme-extension-tools-panel"
						>
							<div
								className="color-block-support-panel__inner-wrapper"
								style={ { gridColumn: '1 / -1' } }
							>
								{ settings.map( ( setting, index ) => {
									return (
										setting.isShown( props ) && (
											<ToolsPanelItem
												key={ index }
												isShownByDefault={ false }
												hasValue={ () =>
													!! setting.hasValue( props )
												}
												onDeselect={ () =>
													setting.resetValue( props )
												}
												label={ setting.label }
												className={ classnames(
													'block-editor-tools-panel-color-gradient-settings__item',
													{
														first: 0 === index,
													}
												) }
											>
												<Dropdown
													popoverProps={ {
														className:
															'sme-popover',
														placement: 'left-start',
														offset: 36,
														shift: true,
													} }
													className={ classnames(
														'block-editor-tools-panel-color-gradient-settings__dropdown',
														'sme-extension-panel',
														{
															'sme-extension-panel--enabled':
																setting.hasValue(
																	props
																),
														}
													) }
													renderToggle={ ( {
														isOpen,
														onToggle,
													} ) => (
														<Button
															onClick={ onToggle }
															aria-expanded={
																isOpen
															}
															className="block-editor-panel-color-gradient-settings__dropdown"
														>
															{ setting.label }

															<Icon
																icon={ icon }
																className="components-panel__icon"
																size={ 20 }
															/>
														</Button>
													) }
													renderContent={ () => (
														<DropdownContentWrapper paddingSize="none">
															<div className="sme-popover__title">
																{
																	setting.label
																}
															</div>
															<fieldset>
																<setting.Content
																	{ ...props }
																/>
															</fieldset>
														</DropdownContentWrapper>
													) }
												/>
											</ToolsPanelItem>
										)
									);
								} ) }
							</div>
						</ToolsPanel>
					</InspectorControls>
				) }
			</>
		);
	};
}, 'addBlockControl' );

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/attributes',
	addBlockAttributes
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/block-control',
	addBlockControl,
	101
);

if ( !! settings ) {
	settings.forEach( ( setting, index ) => {
		addFilter(
			'editor.BlockEdit',
			`snow-monkey-editor/block-edit-${ index }`,
			createHigherOrderComponent( ( BlockEdit ) => ( props ) => {
				const Decorator = setting?.Decorator;
				if ( !! Decorator ) {
					return (
						<Decorator { ...props }>
							<BlockEdit { ...props } />
						</Decorator>
					);
				}
				return <BlockEdit { ...props } />;
			} )
		);
	} );
}
