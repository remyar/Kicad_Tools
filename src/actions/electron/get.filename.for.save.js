import createAction from '../../middleware/actions';

export async function getFilenameForSave( extensions , { extra, getState }) {

    let api = extra.api;
    if ( typeof extensions == 'string'){
        extensions = [extensions];
    }
    try {
        let response = await api.post("/getFilenameForSave" , { extensions: extensions });
        return {
            getFilenameForSave : response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForSave);