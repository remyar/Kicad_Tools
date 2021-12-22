import createAction from '../../middleware/actions';

export async function readFile({ extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.post("/readFile");
        return {
            fileData : response.data.data
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(readFile);