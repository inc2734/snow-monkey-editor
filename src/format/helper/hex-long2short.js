/**
 * @param  { string } hex
 * @return { string } rgb
 */
export default function ( hex ) {
	if ( ! hex || 4 === hex.length ) {
		return hex;
	}

	const matches = hex.match( /^#([0-9A-F])\1([0-9A-F])\1([0-9A-F])\1$/i );
	if ( ! matches ) {
		return hex;
	}
	return `#${ matches[ 1 ].slice( 0, 1 ) }${ matches[ 2 ].slice(
		0,
		1
	) }${ matches[ 3 ].slice( 0, 1 ) }`;
}
