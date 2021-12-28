import createAction from '../../middleware/actions';
import HTMLParser from 'node-html-parser';
import * as zip from "@zip.js/zip.js";

export async function get3DModel(_mpn, _package, { extra, getState }) {
    let api = extra.api;

    try {
        let model3d = undefined;

        let response = await api.get('https://componentsearchengine.com/signin');
        let html = HTMLParser.parse(response);

        let _csrf = html.querySelector("#signin-form > fieldset.submit-buttons.center-text > input[type=hidden]:nth-child(1)")?.attributes?.value?.trim();

        let formData = {
            _csrf: _csrf,
            keepMe : 'on'
        }

        response = await api.post('https://componentsearchengine.com/signin', formData);
        console.log(response);
        return {
            model3d,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(get3DModel);