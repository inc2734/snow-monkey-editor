import { apiFetch as apiFetchAction, controls } from '@wordpress/data-controls';
import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	roles: {},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_ROLES':
			return {
				...state,
				roles: action.roles,
			};
	}
	return state;
};

const actions = {
	setRoles( roles ) {
		return {
			type: 'SET_ROLES',
			roles,
		};
	},

	*fetchRoles() {
		const roles = yield apiFetchAction( {
			path: `/snow-monkey-editor/v1/roles`,
		} );

		return actions.setRoles( roles );
	},

	/*
	receiveRoles( path ) {
		return {
			type: 'RECEIVE_ROLES',
			path,
		};
	},
	*/
};

/*
const controls = {
	RECEIVE_ROLES( action ) {
		return apiFetch( { path: action.path } );
	},
};
*/

const selectors = {
	getRoles( state ) {
		return state.roles;
	},
};

const resolvers = {
	*getRoles() {
		yield actions.fetchRoles();
	},
};

export const store = createReduxStore( 'snow-monkey-editor/roles', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
} );

register( store );
