import createAction from '../../middleware/actions';

export async function getPartsByCategorieId(id, { extra, getState }) {

    const ipcRenderer = extra.ipcRenderer;

    try {
        let result = await ipcRenderer.invoke("database.getPartsByCategorieId", id);
        return {
            parts: result
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getPartsByCategorieId);