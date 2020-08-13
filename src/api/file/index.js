import { remote } from 'electron';

const fs = remote.require('fs');
const path = window.require('path');

function openDialog(filters) {
    let dialog = remote.dialog;

    if (filters == undefined) {
        filters = [
            { name: "Kicad .sch", extensions: ["sch"] },
        ];
    }

    return new Promise((resolve, reject) => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: filters
        }).then((data) => {
            if (data.filePaths) {
                resolve(data.filePaths);
            }
            reject("no file selected");
        }).catch((err) => {
            reject("no file selected");
        });
    });
}

function saveDialog(filters) {
    let dialog = remote.dialog;

    if (filters == undefined) {
        filters = [
            { name: "Kicad .lib", extensions: ["lib"] },
        ];
    }

    return new Promise((resolve, reject) => {
        dialog.showSaveDialog({
            filters: filters
        }).then((data) => {
            if (data.filePath) {
                resolve(data.filePath);
            }
            reject("no file selected");
        }).catch((err) => {
            reject("no file selected");
        });
    });

}

function write(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file , data , 'utf8' , (err ) => {
            resolve(data);
        });
    });
}

function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err != undefined) {
                reject("Impossible to read file : " + file)
            } else {
                resolve(data);
            }
        })
    });
}

function readList(files) {
    let promiseTab = [];

    files.map((file) => {
        promiseTab.push(this.read(file));
    });

    return Promise.all(promiseTab)

}

function getList(p, ext) {
    return new Promise((resolve, reject) => {
        let listPath = [];
        let fileList = fs.readdirSync(p);

        fileList.map((fileName) => {
            if (fileName.endsWith(ext)) {
                listPath.push(p + "\\" + fileName);
            }
        });

        resolve(listPath);
    });
}



export default {
    openDialog,
    saveDialog,
    read,
    write,
    getList,
    readList
}