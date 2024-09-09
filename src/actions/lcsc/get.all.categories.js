import createAction from '../../middleware/actions';

export async function getAllCategories({ extra, getState }) {
    const ipcRenderer = extra.ipcRenderer;
    try {
        let result = await ipcRenderer.invoke("fetch.post", {
            url: "https://m.jlcpcb.com/api/overseas-pcb-order/v1/shoppingCart/smtGood/selectSmtComponentList",
            data: {
                searchType: 1,
                pageSize: 0
            }
        });

        return {
            categories: result
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);