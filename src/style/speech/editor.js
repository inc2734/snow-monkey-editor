import settings from './settings';
import blocks from './blocks';

export default blocks.map( ( name ) => {
	return {
		name,
		settings,
	};
} );
