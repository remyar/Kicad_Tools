import createAction from '../../middleware/actions';

export async function getFilenameForOpen({ extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.get("/getFilenameForOpen");
        return {
            getFilenameForOpen : response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForOpen);