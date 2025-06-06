import { uniq, intersection, includes } from 'lodash';

import {
	Disabled,
	ToggleControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { getBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

import { store } from '../store/roles';

const isShown = ( props ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'editing-lock'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		props.name,
		'editing-lock'
	);
	if ( ! isApplyToBlock ) {
		return false;
	}

	const canEditingLockSetting = includes(
		snowmonkeyeditor?.currentUser?.roles,
		'administrator'
	);
	if ( ! canEditingLockSetting ) {
		return false;
	}

	const blockType = getBlockType( props.name );
	if ( ! blockType ) {
		return false;
	}

	return true;
};

const isLocked = ( props ) => {
	return (
		0 <
		intersection(
			props.attributes.smeIsEditingLockRoles,
			snowmonkeyeditor?.currentUser?.roles
		).length
	);
};

const Decorator = ( props ) => {
	return isLocked( props ) ? (
		<Disabled>{ props.children }</Disabled>
	) : (
		<>{ props.children }</>
	);
};

const Content = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
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

	const block = document.getElementById( `block-${ clientId }` );
	if ( block ) {
		if ( isLocked( props ) ) {
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

	return (
		<VStack spacing="16px">
			{ Object.keys( roles ).map( ( key ) => {
				const labelEditingLockRole = sprintf(
					// translators: %1$s: The role name
					__( 'Edit lock if %1$s', 'snow-monkey-editor' ),
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
						__nextHasNoMarginBottom
						key={ `sme-editing-lock-role-${ key }` }
						label={ labelEditingLockRole }
						checked={ checkedEditingLockRole }
						onChange={ onChangeEditingLockRole }
					/>
				);
			} ) }
		</VStack>
	);
};

export const settings = {
	resetAll: {},
	hasValue: ( props ) =>
		! props.attributes?.smeIsEditingLockRoles ||
		0 < props.attributes?.smeIsEditingLockRoles.length,
	resetValue: ( props ) =>
		props.setAttributes( { smeIsEditingLockRoles: [] } ),
	label: __( 'Editing lock (By roles)', 'snow-monkey-editor' ),
	name: 'editing-lock',
	isShown,
	Content,
	Decorator,
};

export const blockAttributes = ( blockType ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'editing-lock'
	);
	if ( ! isApplyToUser ) {
		return blockType;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		blockType.name,
		'editing-lock'
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
