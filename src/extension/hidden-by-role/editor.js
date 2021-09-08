import { uniq } from 'lodash';
import classnames from 'classnames/dedupe';

import { getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
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
		'hidden-by-role'
	);
	if ( ! isApplyToUser ) {
		return settings;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		settings.name,
		'hidden-by-role'
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
	'snow-monkey-editor/hidden-by-role/attributes',
	addBlockAttributes
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const { smeIsHiddenRoles, className } = attributes;

		const roles = useSelect( ( select ) => {
			const allRoles = select( store ).getRoles();
			const filteredRoles = { ...allRoles };

			return {
				'sme-guest': {
					name: __( 'user is not logged in', 'snow-monkey-editor' ),
				},
				...filteredRoles,
			};
		}, [] );

		let rolesForHiddenByRoles = {};
		if ( snowmonkeyeditor.currentUser.roles.includes( 'administrator' ) ) {
			rolesForHiddenByRoles = { ...roles };
		} else {
			Object.keys( roles ).forEach( ( role, index ) => {
				const hasRole = snowmonkeyeditor.currentUser.roles.includes(
					role
				);
				if ( ! hasRole ) {
					rolesForHiddenByRoles[ role ] = Object.values( roles )[
						index
					];
				}
			} );
		}

		const isApplyToUser = isApplyExtensionToUser(
			snowmonkeyeditor.currentUser,
			'hidden-by-role'
		);
		if ( ! isApplyToUser ) {
			return <BlockEdit { ...props } />;
		}

		const isApplyToBlock = isApplyExtensionToBlock(
			name,
			'hidden-by-role'
		);
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

		const blockType = getBlockType( name );
		if ( ! blockType ) {
			return <BlockEdit { ...props } />;
		}

		const newAttributes = ( key, newValue ) => {
			let newSmeIsHiddenRoles = [ ...smeIsHiddenRoles ];
			if ( true === newValue ) {
				newSmeIsHiddenRoles.push( key );
			} else {
				newSmeIsHiddenRoles = newSmeIsHiddenRoles.filter(
					( value ) => key !== value
				);
			}
			return uniq( newSmeIsHiddenRoles );
		};

		const panelClassName =
			! smeIsHiddenRoles || 0 < smeIsHiddenRoles.length
				? 'sme-extension-panel sme-extension-panel--enabled'
				: 'sme-extension-panel';

		const isHidden =
			!! className &&
			! snowmonkeyeditor.currentUser.roles.includes( 'administrator' ) &&
			smeIsHiddenRoles.some( ( role ) =>
				snowmonkeyeditor.currentUser.roles.includes( role )
			);

		return (
			<>
				{ isHidden ? (
					<div className="sme-hidden-by-role">
						<BlockEdit { ...props } />
					</div>
				) : (
					<BlockEdit { ...props } />
				) }

				<InspectorControls>
					<PanelBody
						title={ __(
							'Display setting (By roles)',
							'snow-monkey-editor'
						) }
						initialOpen={ false }
						icon={ icon }
						className={ panelClassName }
					>
						{ Object.keys( rolesForHiddenByRoles ).map( ( key ) => {
							const hiddenRoleLabel = sprintf(
								// translators: %1$s: The role name
								__( 'Hide if %1$s', 'snow-monkey-editor' ),
								rolesForHiddenByRoles[ key ].name
							);

							const checkedHiddenRole =
								'object' === typeof smeIsHiddenRoles &&
								smeIsHiddenRoles.includes( key );

							const onChangeHiddenRole = ( value ) => {
								const newSmeIsHiddenRoles = newAttributes(
									key,
									value
								);

								setAttributes( {
									smeIsHiddenRoles: newSmeIsHiddenRoles,
									className: classnames( className, {
										[ `sme-hidden-by-role--${ key }` ]: value,
									} ),
								} );
							};

							return (
								<ToggleControl
									key={ `sme-hidden-role-${ key }` }
									label={ hiddenRoleLabel }
									checked={ checkedHiddenRole }
									onChange={ onChangeHiddenRole }
								/>
							);
						} ) }
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSnowMonkeyEditorHiddenByRoleBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/hidden-by-role/block-edit',
	addBlockControl
);
