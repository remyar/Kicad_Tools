import createAction from '../../middleware/actions';

export async function getFootprint(component, { extra, getState }) {
    let api = extra.api;

    try {
        let Tab = [];

        return {
            footprint: Tab,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFootprint);