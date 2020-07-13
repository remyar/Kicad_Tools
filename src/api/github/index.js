const fetch = require('isomorphic-fetch');
let mouser = require('../mouser');
let fileApi = require('../file');
let path = require('path');

function getGithubAllCategories() {
    return new Promise((resolve, reject) => {
        fetch("https://raw.githubusercontent.com/remyar/Kicad_Lib_v2/master/package.json", {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: "GET"
        }).then((response) => {
            if (response.status == 200) {
                resolve(response.json());
            } else {
                reject(response.json());
            }
        }).catch((e) => {
            reject(e);
        });
    });
}


function getFile(url) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            credentials: 'same-origin',
            method: "GET"
        }).then((response) => {
            if (response.status == 200) {
                resolve(response.text());
            } else {
                reject("blabla");
            }
        }).catch((e) => {
            reject(e);
        });
    });
}

async function getAllComponents(components) {

    let results = [];
    await Promise.all(components.map(async (component) => {
        let result = await getFile(component.path + "/" + component.mpn + ".lib");
        results.push(results);
    }));

    return results;

}

async function downloadPowerLib(dataPath) {

    let result = await getFile("https://raw.githubusercontent.com/remyar/Kicad_Lib_v2/master/Power.lib");
    await fileApi.default.write(dataPath + path.sep + "Power.lib", result);

}

async function downloadAllFootprint(dataPath, components) {

    await Promise.all(components.map(async (component) => {
        let result = await getFile(component.path + "/" + component.mpn + ".kicad_mod");
        await fileApi.default.write( dataPath + path.sep + component.mpn + ".kicad_mod" , result)
    }))

}

async function downloadAll3D(dataPath, components) {

    await Promise.all(components.map(async (component) => {
        let result = await getFile(component.path + "/" + component.mpn + ".stp");
        await fileApi.default.write( dataPath + path.sep + component.mpn + ".stp" , result)
    }))

}

export default {
    getGithubAllCategories,
    getAllComponents,
    getFile,
    downloadAllFootprint,
    downloadPowerLib,
    downloadAll3D
}