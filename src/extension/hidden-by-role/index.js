'use select';

import {
	uniq,
} from 'lodash';

import {
	hasBlockSupport,
	getBlockType,
} from '@wordpress/blocks';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
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

import './roles';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/hidden-by-role/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			smeIsHiddenRoles: {
				type: 'array',
				default: [],
			},
		};
		return settings;
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/hidden-by-role/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					setAttributes,
					name,
				} = props;

				const {
					smeIsHiddenRoles,
					className,
				} = attributes;

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				const roles = useSelect( ( select ) => {
					return {
						'sme-guest': __( 'user is not logged in', 'snow-monkey-editor' ),
						...select( 'snow-monkey-editor/roles' ).receiveRoles(),
					};
				}, [] );

				const getUpdatedClassName = ( addedClassName, enable ) => {
					const arrayClassName = className ? className.split( ' ' ) : [];
					const newClassName = true === enable ?
						[ ...arrayClassName, addedClassName ] :
						arrayClassName.filter( ( element ) => addedClassName !== element );

					return uniq( newClassName ).join( ' ' );
				};

				const newAttributes = ( key, newValue ) => {
					let newSmeIsHiddenRoles = [ ...smeIsHiddenRoles ];
					if ( true === newValue ) {
						newSmeIsHiddenRoles.push( key );
					} else {
						newSmeIsHiddenRoles = newSmeIsHiddenRoles.filter( ( value ) => key !== value );
					}
					return newSmeIsHiddenRoles.filter( ( value, index, self ) => self.indexOf( value ) === index );
				};

				return (
					<>
						<BlockEdit { ...props } />

						<InspectorControls>
							<PanelBody title={ __( 'Display setting (By roles)', 'snow-monkey-editor' ) } initialOpen={ false } icon={ icon }>
								{ Object.keys( roles ).map( ( key ) => {
									return (
										<ToggleControl
											key={ `sme-hidden-role-${ key }` }
											label={ sprintf( __( 'Hide if %1$s', 'snow-monkey-editor' ), roles[ key ] ) }
											checked={ smeIsHiddenRoles.includes( key ) }
											onChange={ ( value ) => {
												const newSmeIsHiddenRoles = newAttributes( key, value );
												setAttributes( { smeIsHiddenRoles: newSmeIsHiddenRoles } );
												if ( hasBlockSupport( blockType, 'customClassName', true ) ) {
													setAttributes( { className: getUpdatedClassName( 'sme-hidden-role', 0 < newSmeIsHiddenRoles.length ) } );
												}
											} }
										/>
									);
								} ) }
							</PanelBody>
						</InspectorControls>
					</>
				);
			};
		},
		'withSnowMonkeyEditorHiddenByRoleBlockEdit'
	)
);
