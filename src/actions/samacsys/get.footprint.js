import createAction from '../../middleware/actions';
import HTMLParser from 'node-html-parser';
import * as zip from "@zip.js/zip.js";

export async function getFootprint(_mpn, _package, { extra, getState }) {
    let api = extra.api;

    try {
        let headers = new Headers();

        headers.append('Authorization', 'Basic ' + btoa(process.env.REACT_APP_SAMACSYS_LOGIN + ":" + process.env.REACT_APP_SAMACSYS_PASSWORD));

        let resp = await api.get("https://componentsearchengine.com/ga/auth.txt?", {
            headers
        });

        let componentSearchApi = await api.get('https://eagle.componentsearchengine.com/alligatorHandler.php?detail=0&searchString=' + _mpn + '&offset=0&country=GB&language=en&et=kicad&pv=1.4')

        if (typeof componentSearchApi == 'string') {
            componentSearchApi = JSON.parse(componentSearchApi);
        }

        let _comp = undefined;
        for (let _f of componentSearchApi.parts) {
            if (_f.PartNo == _mpn) {
                _comp = _f;
            }
        }

        let buffer = undefined;
        let model = undefined;

        if (_comp && _comp.PartID) {
            buffer = await api.get("https://componentsearchengine.com/ga/model.php?partID=" + _comp.PartID + "", {
                headers,
                responseType: 'arraybuffer'
            });
        }

        if (buffer && buffer.byteLength > 100) {
            zip.configure({
                useWebWorkers: false
            });

            const reader = new zip.ZipReader(new zip.BlobReader(new Blob([new Uint8Array(buffer, 0, buffer.byteLength)])));
            // get all entries from the zip
            const entries = await reader.getEntries();

            console.log(entries)

            for (let entry of entries) {
                if (entry.filename && entry.filename.toLocaleLowerCase().includes('kicad') && entry.filename.endsWith(".kicad_mod")) {
                    // get first entriesentry content as text by using a TextWriter
                    const text = await entry.getData(
                        // writer
                        new zip.TextWriter(),
                        // options
                        {
                            onprogress: (index, max) => {
                                // onprogress callback
                                //console.log(index, max);
                            }
                        }
                    );

                    let _text = text.split('\n');
                    model = [];
                    for (let line of _text) {
                        line = line.replace('\r', '');
                        model.push(line.trim());
                    }
                }
            }
        }
        return {
            footprint: model,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFootprint);