'use select';

import { uniq } from 'lodash';

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

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/hidden-by-role/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			...customAttributes,
		};
		return settings;
	}
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const { smeIsHiddenRoles } = attributes;

		const currentUser = useSelect( ( select ) => {
			return select( 'core' ).getCurrentUser();
		}, [] );

		const roles = useSelect( ( select ) => {
			const allRoles = select(
				'snow-monkey-editor/roles'
			).receiveRoles();
			const filteredRoles = { ...allRoles };

			return {
				'sme-guest': {
					name: __( 'user is not logged in', 'snow-monkey-editor' ),
				},
				...filteredRoles,
			};
		}, [] );

		if ( 0 < Object.keys( currentUser ).length ) {
			const isApplyToUser = isApplyExtensionToUser(
				currentUser,
				'hidden-by-role'
			);
			if ( ! isApplyToUser ) {
				return <BlockEdit { ...props } />;
			}
		}

		const isApplyToBlock = isApplyExtensionToBlock(
			name,
			'hidden-by-role'
		);
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

		if ( 'undefined' === typeof smeIsHiddenRoles ) {
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
			0 < smeIsHiddenRoles.length
				? 'sme-extension-panel sme-extension-panel--enabled'
				: 'sme-extension-panel';

		return (
			<>
				<BlockEdit { ...props } />

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
						{ Object.keys( roles ).map( ( key ) => {
							const hiddenRoleLabel = sprintf(
								__( 'Hide if %1$s', 'snow-monkey-editor' ),
								roles[ key ].name
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
