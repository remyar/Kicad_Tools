import createAction from '../../middleware/actions';
import easyeda from '../../utils/easyeda';

export async function getFootprint(component, { extra, getState }) {
    let api = extra.api;

    try {
        let res = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/components?version=6.4.19.5");
        let js = JSON.parse(res);
        if ( js.success == true )
        {
            let _res = await easyeda.getFootprint(js.result);
            return {
                footprint: _res,
            }
        } else {
            throw { message : "Symbol not found" }
        }


    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFootprint);