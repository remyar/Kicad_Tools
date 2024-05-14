import createAction from '../../middleware/actions';

export async function getAllCategories({ extra, getState }) {

    const ipcRenderer = extra.ipcRenderer;

    try {
        let result = await ipcRenderer.invoke("database.getAllCategories");
        return {
            categories: result
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);