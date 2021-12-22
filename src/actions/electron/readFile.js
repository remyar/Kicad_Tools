import createAction from '../../middleware/actions';

export async function readFile(filepath , { extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.post("/readFile", { filepath });
        return {
            fileData : response.data.data
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(readFile);