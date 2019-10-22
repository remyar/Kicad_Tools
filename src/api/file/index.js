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
        }).then((data)=>{
            if ( data.filePaths ){
                resolve(data.filePaths);
            }
        }).catch((err)=>{
            reject("no file selected");
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