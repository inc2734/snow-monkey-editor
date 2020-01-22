'use select';

import {
	uniq,
	intersection,
	includes,
} from 'lodash';

import {
	getBlockType,
} from '@wordpress/blocks';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	Disabled,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

import {
	addFilter,
} from '@wordpress/hooks';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	useSelect,
} from '@wordpress/data';

import {
	sprintf,
	__,
} from '@wordpress/i18n';

import {
	icon,
} from '../../js/helper/icon';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/editing-lock/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			smeIsEditingLockRoles: {
				type: 'array',
				default: [],
			},
		};
		return settings;
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/editing-lock/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					setAttributes,
					name,
					clientId,
				} = props;

				const {
					smeIsEditingLockRoles,
				} = attributes;

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				const roles = useSelect( ( select ) => {
					const _roles = select( 'snow-monkey-editor/roles' ).receiveRoles();
					delete _roles.administrator;
					return _roles;
				}, [] );

				const currentUser = useSelect( ( select ) => {
					return select( 'core' ).getCurrentUser();
				}, [] );

				const newAttributes = ( key, newValue ) => {
					let newSmeIsEditingLockRoles = [ ...smeIsEditingLockRoles ];
					if ( true === newValue ) {
						newSmeIsEditingLockRoles.push( key );
					} else {
						newSmeIsEditingLockRoles = newSmeIsEditingLockRoles.filter( ( value ) => key !== value );
					}
					return uniq( newSmeIsEditingLockRoles );
				};

				const isLocked = 0 < intersection( smeIsEditingLockRoles, currentUser.roles ).length;

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
						const defaultTabindex = block.getAttribute( 'data-sme-tabindex' );
						if ( !! tabindex && !! defaultTabindex ) {
							block.setAttribute( 'tabindex', defaultTabindex );
							block.removeAttribute( 'data-sme-tabindex' );
						}
					}
				}

				const canEditingLockSetting = includes( currentUser.roles, 'administrator' );

				return (
					<>
						{ isLocked ? (
							<Disabled>
								<BlockEdit { ...props } />
							</Disabled>
						) : (
							<BlockEdit { ...props } />
						) }

						{ canEditingLockSetting &&
							<InspectorControls>
								<PanelBody title={ __( 'Editing lock (By roles)', 'snow-monkey-editor' ) } initialOpen={ false } icon={ icon }>
									{ Object.keys( roles ).map( ( key ) => {
										return (
											<ToggleControl
												key={ `sme-editing-lock-role-${ key }` }
												label={ sprintf( __( 'Edit lock if %1$s', 'snow-monkey-editor' ), roles[ key ] ) }
												checked={ 'object' === typeof smeIsEditingLockRoles && smeIsEditingLockRoles.includes( key ) }
												onChange={ ( value ) => {
													const newSmeIsEditingLockRoles = newAttributes( key, value );
													setAttributes( { smeIsEditingLockRoles: newSmeIsEditingLockRoles } );
												} }
											/>
										);
									} ) }
								</PanelBody>
							</InspectorControls>
						}
					</>
				);
			};
		},
		'withSnowMonkeyEditorEditingLockByRoleBlockEdit'
	)
);