import apiFetch from '@wordpress/api-fetch';
import { registerStore } from '@wordpress/data';

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

	receiveRoles( path ) {
		return {
			type: 'RECEIVE_ROLES',
			path,
		};
	},
};

const controls = {
	RECEIVE_ROLES( action ) {
		return apiFetch( { path: action.path } );
	},
};

const selectors = {
	receiveRoles( state ) {
		const { roles } = state;
		return roles;
	},
};

const resolvers = {
	*receiveRoles() {
		const path = '/snow-monkey-editor/v1/roles';
		const roles = yield actions.receiveRoles( path );
		yield actions.setRoles( roles );
	},
};

registerStore( 'snow-monkey-editor/roles', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
} );
