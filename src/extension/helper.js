import { applyFilters } from '@wordpress/hooks';

function getAllowedNameSpaces( extensionName ) {
	return applyFilters(
		'SnowMonkeyEditor.extension.allowedNameSpaces',
		[ 'core', 'snow-monkey-blocks' ],
		extensionName
	);
}

function getAllowedRoles( extensionName ) {
	return applyFilters(
		'SnowMonkeyEditor.extension.allowedRoles',
		[ 'administrator', 'editor', 'author', 'contributor' ],
		extensionName
	);
}

export function isApplyExtensionToBlock( blockName, extensionName ) {
	const allowedNameSpaces = getAllowedNameSpaces( extensionName );
	const filteredAllowedNameSpaces = allowedNameSpaces.filter(
		( namespace ) => {
			return 0 === blockName.indexOf( namespace );
		}
	);

	return 0 < filteredAllowedNameSpaces.length;
}

export function isApplyExtensionToUser( user, extensionName ) {
	if ( ! user || ! Object.keys( user ).length ) {
		return false;
	}

	const allowedRoles = getAllowedRoles( extensionName );
	const filteredUserRoles = user.roles.filter( ( role ) => {
		return -1 < allowedRoles.indexOf( role );
	} );

	return 0 < filteredUserRoles.length;
}
