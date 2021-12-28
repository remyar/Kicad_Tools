import createAction from '../../middleware/actions';

import * as zip from "@zip.js/zip.js";

import HTMLParser from 'node-html-parser';

export async function get3DModel(_mpn, _package, { extra, getState }) {
    let api = extra.api;

    try {
        let filterPackage = [
            { name: "PDIP", filter: "DIP" }
        ]

        filterPackage.forEach((_f) => {
            _package = _package.replace(_f.name, _f.filter);
        });

        let model3d = [];

        var formData = new FormData(); //--{ username : process.env.REACT_APP_SNAPEDA_LOGIN , password : process.env.REACT_APP_SNAPEDA_PASSWORD })

        formData.append('username', process.env.REACT_APP_SNAPEDA_LOGIN);
        formData.append('password', process.env.REACT_APP_SNAPEDA_PASSWORD);

        let token = (await api.post("https://www.snapeda.com/account/api-login/", formData))?.data;
        let resp = await api.get("https://www.snapeda.com/api/v1/search_local?q=" + _mpn + "&token=" + token.token + "&SEARCH=Search&sort=&resistance=&tolerance=&search-type=parts&has_3d=1&package=" + _package);

        if (resp.results.length > 0) {
            let comp = resp.results[0];

            resp = await api.get("https://www.snapeda.com/api/v1/parts/download_part?uniqueid=" + comp.unipart_id + "&manufacturer=" + comp.manufacturer + "&part_number=" + comp.part_number + "&format=kicad_mod&token=" + token.token);

            let buffer = await api.get(resp.url, { responseType: 'arraybuffer', });

            zip.configure({
                useWebWorkers: false
            });

            const reader = new zip.ZipReader(new zip.BlobReader(new Blob([new Uint8Array(buffer, 0, buffer.byteLength)])));
            // get all entries from the zip
            const entries = await reader.getEntries();

            console.log(entries)

            for ( let entry of entries){
                if (entry.filename && entry.filename.endsWith(".step")) {
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

                    // text contains the entry data as a String
                    model3d.push(text);
                }
            }
        }

        return {
            model3d,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(get3DModel);