import { uniq } from 'lodash';
import classnames from 'classnames/dedupe';

import {
	ToggleControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { getBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

import { store } from '../store/roles';

const isShown = ( props ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'hidden-by-role'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		props.name,
		'hidden-by-role'
	);
	if ( ! isApplyToBlock ) {
		return false;
	}

	const blockType = getBlockType( props.name );
	if ( ! blockType ) {
		return false;
	}

	return true;
};

const useGetRoles = () => {
	return useSelect( ( select ) => {
		const allRoles = select( store ).getRoles();
		const filteredRoles = { ...allRoles };

		return {
			'sme-guest': {
				name: __( 'user is not logged in', 'snow-monkey-editor' ),
			},
			...filteredRoles,
		};
	}, [] );
};

const useGetRolesForHiddenByRoles = () => {
	const roles = useGetRoles();

	let rolesForHiddenByRoles = {};
	if ( snowmonkeyeditor?.currentUser?.roles?.includes( 'administrator' ) ) {
		rolesForHiddenByRoles = { ...roles };
	} else {
		Object.keys( roles ).forEach( ( role, index ) => {
			const hasRole =
				snowmonkeyeditor?.currentUser?.roles?.includes( role );
			if ( ! hasRole ) {
				rolesForHiddenByRoles[ role ] = Object.values( roles )[ index ];
			}
		} );
	}

	return rolesForHiddenByRoles;
};

const Decorator = ( props ) => {
	const { attributes, children } = props;
	const { className, smeIsHiddenRoles = [] } = attributes;

	const isDecorate =
		!! className &&
		! snowmonkeyeditor?.currentUser?.roles?.includes( 'administrator' ) &&
		smeIsHiddenRoles.some( ( role ) =>
			snowmonkeyeditor?.currentUser?.roles?.includes( role )
		);

	return isDecorate ? (
		<div className="sme-hidden-by-role">{ children }</div>
	) : (
		<>{ children }</>
	);
};

const Content = ( props ) => {
	const { attributes, setAttributes } = props;
	const { smeIsHiddenRoles, className } = attributes;

	const rolesForHiddenByRoles = useGetRolesForHiddenByRoles();

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

	useEffect( () => {
		const newClassNameMap = {};
		Object.keys( rolesForHiddenByRoles ).forEach( ( role ) => {
			newClassNameMap[ `sme-hidden-by-role--${ role }` ] = false;
		} );
		smeIsHiddenRoles.forEach( ( role ) => {
			newClassNameMap[ `sme-hidden-by-role--${ role }` ] = true;
		} );
		setAttributes( {
			className: classnames( className, {
				...newClassNameMap,
			} ),
		} );
	}, [ smeIsHiddenRoles ] );

	return (
		<VStack spacing="16px">
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
					const newSmeIsHiddenRoles = newAttributes( key, value );

					setAttributes( {
						smeIsHiddenRoles: newSmeIsHiddenRoles,
					} );
				};

				return (
					<ToggleControl
						__nextHasNoMarginBottom
						key={ `sme-hidden-role-${ key }` }
						label={ hiddenRoleLabel }
						checked={ checkedHiddenRole }
						onChange={ onChangeHiddenRole }
					/>
				);
			} ) }
		</VStack>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) =>
		! props.attributes?.smeIsHiddenRoles ||
		0 < props.attributes?.smeIsHiddenRoles.length,
	resetValue: ( props ) => {
		props.setAttributes( {
			smeIsHiddenRoles: customAttributes.smeIsHiddenRoles.default,
		} );
	},
	resetClassnames: ( props ) => {
		const rolesForHiddenByRoles = props.attributes?.smeIsHiddenRoles || [];
		const newClassNameMap = {};
		rolesForHiddenByRoles.forEach( ( role ) => {
			newClassNameMap[ `sme-hidden-by-role--${ role }` ] = false;
		} );
		return newClassNameMap;
	},
	label: __( 'Display setting (By roles)', 'snow-monkey-editor' ),
	isShown,
	Content,
	Decorator,
};

export const blockAttributes = ( blockType ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'hidden-by-role'
	);
	if ( ! isApplyToUser ) {
		return blockType;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		blockType.name,
		'hidden-by-role'
	);
	if ( ! isApplyToBlock ) {
		return blockType;
	}

	blockType.attributes = {
		...blockType.attributes,
		...customAttributes,
	};

	return blockType;
};
