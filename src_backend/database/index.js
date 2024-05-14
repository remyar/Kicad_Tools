const fs = require('fs');
const path = require("path");
const StreamZip = require('node-stream-zip');

let dtabasePath = undefined;

async function setdbPath(_path, options) {
    const zip = new StreamZip.async({ file: _path });
    dtabasePath = zip;
}

async function readFileSync(_databaseName) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await dtabasePath.entryData(_databaseName + ".json");
            let result = JSON.parse(data.toString());
            resolve(result);
        } catch (err) {
            reject(err);
        }
    })
}

async function getAllCategories(){
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("categories");
            resolve(result.sortAndCountVoList || []);
        } catch (err) {
            reject(err);
        }
    })
}

async function getPartsByCategorieId(id){
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("categories/" + id);
            resolve(result?.componentPageInfo?.list || []);
        } catch (err) {
            reject(err);
        }
    }) 
}

module.exports = {
    setdbPath,
    getAllCategories,
    getPartsByCategorieId,
}