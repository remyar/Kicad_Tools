import createAction from '../../middleware/actions';

export async function writeFile(filepath , data , { extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.post("/writeFile" , { filepath , data} );
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(writeFile);