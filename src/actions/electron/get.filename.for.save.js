import createAction from '../../middleware/actions';

export async function getFilenameForSave({ extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.get("/getFilenameForSave");
        return {
            getFilenameForSave : response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForSave);