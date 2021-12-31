import createAction from '../../middleware/actions';

export async function set(key, value, { extra, getState }) {
    let state = getState();
    let settings = state.settings;
    settings[key] = {...value};
    return {
        settings
    }
}

export default createAction(set);