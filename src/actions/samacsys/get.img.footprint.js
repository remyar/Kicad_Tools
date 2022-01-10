import createAction from '../../middleware/actions';
import HTMLParser from 'node-html-parser';
import * as zip from "@zip.js/zip.js";

export async function getImgFootprint(_mpn, _package, { extra, getState }) {
    let api = extra.api;

    try {

        let headers = new Headers();

        headers.append('Authorization', 'Basic ' + btoa(process.env.REACT_APP_SAMACSYS_LOGIN + ":" + process.env.REACT_APP_SAMACSYS_PASSWORD ));

        let resp = await api.get("https://componentsearchengine.com/ga/auth.txt?", {
            headers
        });

        let componentSearchApi = await api.get('https://eagle.componentsearchengine.com/alligatorHandler.php?detail=0&searchString=' + _mpn + '&offset=0&country=GB&language=en&et=kicad&pv=1.4')

        if (typeof componentSearchApi == 'string') {
            componentSearchApi = JSON.parse(componentSearchApi);
        }

        let _comp = undefined;
        for ( let _f of componentSearchApi.parts ){
            if ( _f.PartNo == _mpn ){
                _comp = _f;
            }
        }
      
        let buffer = undefined;
        let model = undefined;
        if ( _comp && _comp.PartID ){
            buffer = await api.get("http://componentsearchengine.com/footprint.php?partID=" + _comp.PartID + "", {
                headers,
                responseType : 'arraybuffer'
            });
        }

        if ( buffer ){
            model = Buffer.from(buffer).toString('base64')
        }
      
        return {
            imgFootprint: model,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getImgFootprint);