import createAction from '../../middleware/actions';

export async function search(_filter , { extra, getState }) {
    const ipcRenderer = extra.ipcRenderer;
    try {
        let result = await ipcRenderer.invoke("fetch.post", {
            url : "https://jlcpcb.com/api/overseas-pcb-order/v1/shoppingCart/smtGood/selectSmtComponentList",
            data : {
                keyword: _filter,
                searchSource : "search",
                currentPage : 1,
                pageSize : 25
            }
        });
        console.log(result);
    } catch(err){
        throw { message: err.message };
    }
}

export default createAction(search);