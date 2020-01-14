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

export default {
    getGithubAllCategories,
}