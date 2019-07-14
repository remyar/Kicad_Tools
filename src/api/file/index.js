import {remote}  from 'electron';

const fs = remote.require('fs');

function openDialog( filters ){
    let dialog = remote.dialog;

    if ( filters == undefined ){
        filters = [
            { name : "Kicad .sch" , extensions : ["sch"] },
        ];
    }

    return new Promise((resolve , reject ) => {
        dialog.showOpenDialog({       
            properties: ['openFile'],
            filters : filters
        }, function (files) {
            if ( files == undefined )
                return reject("no file selected");
            else
                return resolve(files);
        });
    });
}

function read ( file ){
    return new Promise((resolve , reject ) => {
        fs.readFile(file,'utf8',(err , data) => {
            if ( err != undefined ){
                reject("Impossible to read file : " + file)
            } else {
                resolve(data);
            }
        })
    });
}

export default {
    openDialog,
    read
}