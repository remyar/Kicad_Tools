import createAction from '../../middleware/actions';

export async function get(key, { extra, getState }) {
    let state = getState();
    
    return state.settings[key];
}

export default createAction(get);