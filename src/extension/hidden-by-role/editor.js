import { uniq } from 'lodash';
import classnames from 'classnames/dedupe';

import { getBlockType } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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

	return (
		<>
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
		</>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) =>
		! props.attributes?.smeIsHiddenRoles ||
		0 < props.attributes?.smeIsHiddenRoles.length,
	resetValue: ( props ) => props.setAttributes( { smeIsHiddenRoles: [] } ),
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
