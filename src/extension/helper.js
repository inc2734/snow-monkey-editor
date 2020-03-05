import {
	applyFilters,
} from '@wordpress/hooks';

function getAllowedNameSpaces() {
	return applyFilters(
		'SnowMonkeyEditor.extension.allowedNameSpaces',
		[
			'core',
			'snow-monkey-blocks',
		]
	);
}

export function isApplyExtension( blockName ) {
	const allowedNameSpaces = getAllowedNameSpaces();
	const isApply = allowedNameSpaces.filter(
		( namespace ) => {
			return 0 === blockName.indexOf( namespace )
		}
	);

	return 0 < isApply.length;
}
