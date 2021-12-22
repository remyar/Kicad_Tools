import createAction from '../../middleware/actions';

export async function getFilenameForOpen(extensions, { extra, getState }) {

    let api = extra.api;

    if ( typeof extensions == 'string'){
        extensions = [extensions];
    }
    try {
        let response = await api.post("/getFilenameForOpen", { extensions: extensions });
        return {
            getFilenameForOpen: response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForOpen);