import createAction from '../../middleware/actions';

export async function get3DModel(_mpn, _package, { extra, getState }) {
    let api = extra.api;
    let models = [];
    try {

        let url = "https://easyeda.com/api/components/search/footprintManager?";
        url += "doctype=16&uid=user&returnListStyle=classifyarr&wd=" + _mpn + "&version=6.4.32";

        let resp = await api.post(url, {});
        if (typeof resp == 'string') {
            resp = JSON.parse(resp);
        }

        if (resp && resp.result && resp.result.lists) {
            let lists = resp.result.lists;
            if (lists.lcsc.length > 0) {
                models = [...models, ...lists.lcsc];
            }
            if (lists.easyeda.length > 0) {
                models = [...models, ...lists.easyeda];
            }
            if (lists.user.length > 0) {
                models = [...models, ...lists.user];
            }
        }

        url = "https://easyeda.com/api/components/search/footprintManager?";
        url += "doctype=16&uid=user&returnListStyle=classifyarr&wd=" + _package + "&version=6.4.32";
        
        resp = await api.post(url, {});
        if (typeof resp == 'string') {
            resp = JSON.parse(resp);
        }

        if (resp && resp.result && resp.result.lists) {
            let lists = resp.result.lists;
            if (lists.lcsc.length > 0) {
                models = [...models, ...lists.lcsc];
            }
            if (lists.easyeda.length > 0) {
                models = [...models, ...lists.easyeda];
            }
            if (lists.user.length > 0) {
                models = [...models, ...lists.user];
            }
        }

        return {
            models3d: models,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(get3DModel);