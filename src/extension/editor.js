import classnames from 'classnames/dedupe';

import {
	Button,
	Dropdown,
	Icon,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components';

import {
	createHigherOrderComponent,
	useViewportMatch,
} from '@wordpress/compose';

import { InspectorControls } from '@wordpress/block-editor';
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

/**
 * @see https://github.com/WordPress/gutenberg/blob/9122cc34fb1d972cdfc59614bf6f140a9b6f7d94/packages/block-library/src/utils/hooks.js
 */
function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
					offset: 259,
				},
		  }
		: {};
}

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const isExtensionsShown = settings.some( ( setting ) =>
			setting.isShown( props )
		);

		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

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

								let newClassNames = {};
								settings.forEach( ( setting ) => {
									if ( !! setting?.resetClassnames ) {
										newClassNames = {
											...newClassNames,
											...setting.resetClassnames( props ),
										};
									}
								} );
								if (
									0 < Object.values( newClassNames ).length
								) {
									props.setAttributes( {
										className: classnames(
											props.attributes.className,
											{
												...newClassNames,
											}
										),
									} );
								}
							} }
							className="color-block-support-panel sme-extension-tools-panel"
							dropdownMenuProps={ dropdownMenuProps }
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
												onDeselect={ () => {
													setting.resetValue( props );

													if (
														!! setting?.resetClassnames
													) {
														const newClassNames = {
															...setting.resetClassnames(
																props
															),
														};

														props.setAttributes( {
															className:
																classnames(
																	props
																		.attributes
																		.className,
																	{
																		...newClassNames,
																	}
																),
														} );
													}
												} }
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
														className: `sme-popover sme-popover--${ setting.name }`,
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
