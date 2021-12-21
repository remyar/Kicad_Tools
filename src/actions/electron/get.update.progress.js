import createAction from '../../middleware/actions';

export async function getUpdateProgress({ extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.get("/update-progress");
        return{
            updateProgress : response
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getUpdateProgress);