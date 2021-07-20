import { uniq, intersection, includes } from 'lodash';

import { getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { Disabled, PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { sprintf, __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';
import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

import { store } from '../store/roles';

const addBlockAttributes = ( settings ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor.currentUser,
		'editing-lock'
	);
	if ( ! isApplyToUser ) {
		return settings;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		settings.name,
		'editing-lock'
	);
	if ( ! isApplyToBlock ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		...customAttributes,
	};
	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/editing-lock/attributes',
	addBlockAttributes
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name, clientId } = props;

		const { smeIsEditingLockRoles } = attributes;

		const roles = useSelect( ( select ) => {
			const allRoles = select( store ).getRoles();
			const filteredRoles = { ...allRoles };
			delete filteredRoles.administrator;
			Object.keys( filteredRoles ).forEach( ( role ) => {
				if ( true !== filteredRoles[ role ].capabilities.edit_posts ) {
					delete filteredRoles[ role ];
				}
			} );
			return filteredRoles;
		}, [] );

		const isApplyToUser = isApplyExtensionToUser(
			snowmonkeyeditor.currentUser,
			'editing-lock'
		);
		if ( ! isApplyToUser ) {
			return <BlockEdit { ...props } />;
		}

		const isApplyToBlock = isApplyExtensionToBlock( name, 'editing-lock' );
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

		const blockType = getBlockType( name );
		if ( ! blockType ) {
			return <BlockEdit { ...props } />;
		}

		const newAttributes = ( key, newValue ) => {
			let newSmeIsEditingLockRoles = [ ...smeIsEditingLockRoles ];
			if ( true === newValue ) {
				newSmeIsEditingLockRoles.push( key );
			} else {
				newSmeIsEditingLockRoles = newSmeIsEditingLockRoles.filter(
					( value ) => key !== value
				);
			}
			return uniq( newSmeIsEditingLockRoles );
		};

		const isLocked =
			0 <
			intersection(
				smeIsEditingLockRoles,
				snowmonkeyeditor.currentUser.roles
			).length;

		const block = document.getElementById( `block-${ clientId }` );
		if ( block ) {
			if ( isLocked ) {
				const tabindex = block.getAttribute( 'tabindex' );
				if ( !! tabindex ) {
					block.setAttribute( 'data-sme-tabindex', tabindex );
					block.setAttribute( 'tabindex', -1 );
				}
			} else {
				const tabindex = block.getAttribute( 'tabindex' );
				const defaultTabindex = block.getAttribute(
					'data-sme-tabindex'
				);
				if ( !! tabindex && !! defaultTabindex ) {
					block.setAttribute( 'tabindex', defaultTabindex );
					block.removeAttribute( 'data-sme-tabindex' );
				}
			}
		}

		const canEditingLockSetting = includes(
			snowmonkeyeditor.currentUser.roles,
			'administrator'
		);

		const panelClassName =
			! smeIsEditingLockRoles || 0 < smeIsEditingLockRoles.length
				? 'sme-extension-panel sme-extension-panel--enabled'
				: 'sme-extension-panel';

		return (
			<>
				{ isLocked ? (
					<Disabled>
						<BlockEdit { ...props } />
					</Disabled>
				) : (
					<BlockEdit { ...props } />
				) }

				{ canEditingLockSetting && (
					<InspectorControls>
						<PanelBody
							title={ __(
								'Editing lock (By roles)',
								'snow-monkey-editor'
							) }
							initialOpen={ false }
							icon={ icon }
							className={ panelClassName }
						>
							{ Object.keys( roles ).map( ( key ) => {
								const labelEditingLockRole = sprintf(
									// translators: %1$s: The role name
									__(
										'Edit lock if %1$s',
										'snow-monkey-editor'
									),
									roles[ key ].name
								);

								const checkedEditingLockRole =
									'object' === typeof smeIsEditingLockRoles &&
									smeIsEditingLockRoles.includes( key );

								const onChangeEditingLockRole = ( value ) => {
									const newSmeIsEditingLockRoles = newAttributes(
										key,
										value
									);
									setAttributes( {
										smeIsEditingLockRoles: newSmeIsEditingLockRoles,
									} );
								};

								return (
									<ToggleControl
										key={ `sme-editing-lock-role-${ key }` }
										label={ labelEditingLockRole }
										checked={ checkedEditingLockRole }
										onChange={ onChangeEditingLockRole }
									/>
								);
							} ) }
						</PanelBody>
					</InspectorControls>
				) }
			</>
		);
	};
}, 'withSnowMonkeyEditorEditingLockByRoleBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/editing-lock/block-edit',
	addBlockControl
);
