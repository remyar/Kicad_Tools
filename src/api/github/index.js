const fetch = require('isomorphic-fetch');
let mouser = require('../mouser');

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

        Promise.all(promiseTab).then((results) => {
            resolve(results);
        });
        
    });
}

export default {
    getGithubAllCategories,
    getAllComponents,
    getFile
}