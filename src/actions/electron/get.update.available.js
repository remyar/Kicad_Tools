import createAction from '../../middleware/actions';

export async function getUpdateAvailable({ extra, getState }) {

    let api = extra.api;

    try {
        let response = await api.get("/update-available");
        return{
            updateAvailable : response
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getUpdateAvailable);