import createAction from '../../middleware/actions';

export async function getImgFootprint(component, { extra, getState }) {
    let api = extra.api;

    try {

        let model = undefined;
        let respSvgs = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");
        if (typeof respSvgs == 'string') {
            respSvgs = JSON.parse(respSvgs)
        }

        if (respSvgs?.success == true) {
            let _symbol = respSvgs.result.find((r) => r.docType == 4);
            if (_symbol && _symbol.svg) {
                model = _symbol.svg;
            }
        }
        return {
            imgFootprint: model,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getImgFootprint);