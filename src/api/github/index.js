const fetch = require('isomorphic-fetch');

function getGithubAllCategories (){
    return new Promise((resolve , reject ) => {
        fetch("https://raw.githubusercontent.com/remyar/Kicad_lib/_dev_tool/package.json",{
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: "GET"
        }).then((response)=>{
            if ( response.status == 200){
                resolve(response.json());
            } else {
                reject(response.json());
            } 
        }).catch((e)=>{
            reject(e);
        });
    });
}

export default {
    getGithubAllCategories
}