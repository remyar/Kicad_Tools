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

function getAllComponents(components) {
    return new Promise((resolve, reject) => {
        let promiseTab = [];

        components.map((component) => {
            promiseTab.push(getFile(component.path + "/" + component.mpn + ".lib"));
        });

        promiseTab.push(getFile("https://raw.githubusercontent.com/remyar/Kicad_Lib_v2/master/Power.lib"));

        Promise.all(promiseTab).then((results) => {
            resolve(results);
        });
        
    });
}

function downloadAllFootprint(dataPath , components){
    return new Promise((resolve, reject) => {
        let promiseTab = [];

        components.map((component) => {
            promiseTab.push(getFile(component.path + "/" + component.mpn + ".kicad_mod"));
        });
        
        Promise.all(promiseTab).then((results) => {
            promiseTab = [];

            components.map((component , idx ) => {
                promiseTab.push(fileApi.default.write( dataPath + path.sep + component.mpn + ".kicad_mod" , results[idx]));
            });

            return Promise.all(promiseTab);
        }).then((result)=>{
            resolve();
        })
    });
}

export default {
    getGithubAllCategories,
    getAllComponents,
    getFile,
    downloadAllFootprint
}