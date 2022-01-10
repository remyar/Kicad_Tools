import createAction from '../../middleware/actions';

export async function get3DModel(_mpn, _package, { extra, getState }) {
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

        let _comp = componentSearchApi.parts.find((_f) => _f.PartNo == _mpn);
        let model = undefined;
        if (_comp && _comp.Has3D) {
            if (_comp.Has3D == 'Y') {
                model = await api.get("https://componentsearchengine.com/ga/model.php?partID=" + _comp.PartID + "&step=1", {
                    headers
                });
                //-- "https://componentsearchengine.com/ga/model.php?partID=" & partID & "&vrml=1"
            }
        }
        return {
            model3d: model,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(get3DModel);