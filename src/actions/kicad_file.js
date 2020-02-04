import path from 'path';

export const KICAD_CREATE_BOM_START = "KICAD_CREATE_BOM_START";
export const KICAD_CREATE_BOM_PRO_START = "KICAD_CREATE_BOM_PRO_START";
export const KICAD_CREATE_BOM_SUCCESS = "KICAD_CREATE_BOM_SUCCESS";
export const KICAD_CREATE_BOM_ERROR = "KICAD_CREATE_BOM_ERROR";
export const KICAD_READ_LIBRARIE_START = "KICAD_READ_LIBRARIE_START";
export const KICAD_READ_LIBRARIE_SUCCESS = "KICAD_READ_LIBRARIE_SUCCESS";
export const KICAD_READ_LIBRARIE_ERROR = "KICAD_READ_LIBRARIE_ERROR";

export const KICAD_NEW_LIBRARIE_START = "KICAD_NEW_LIBRARIE_START";

export const KICAD_SAVE_LIBRARIE_START = "KICAD_SAVE_LIBRARIE_START";

export const KICAD_DOWNLOAD_FOOTPRINT_START = "KICAD_DOWNLOAD_FOOTPRINT_START";
export const KICAD_DOWNLOAD_FOOTPRINT_SUCCESS = "KICAD_DOWNLOAD_FOOTPRINT_SUCCESS";
export const KICAD_DOWNLOAD_FOOTPRINT_ERROR = "KICAD_DOWNLOAD_FOOTPRINT_ERROR";

function openKicadBomXml(){
    return {
        type : KICAD_CREATE_BOM_START 
    }
}

function openKicadProject(){
    return {
        type : KICAD_CREATE_BOM_PRO_START,
    }
}

function openKicadLibraire(){
    return {
        type : KICAD_READ_LIBRARIE_START,
    }
}

function newKicadLibrarie(){
    return {
        type : KICAD_NEW_LIBRARIE_START,
    }
}

function saveKicadLibrarie(filename,data , existingComponents){
    return {
        type : KICAD_SAVE_LIBRARIE_START,
        filename : filename,
        data : data,
        existingComponents : existingComponents
    }
}

function downloadKicadFootprint(filename , allComponents){

    return {
        type : KICAD_DOWNLOAD_FOOTPRINT_START,
        path : filename.substring(0 , filename.lastIndexOf(path.sep)),
        allComponents : allComponents
    }
}


export default {
    KICAD_CREATE_BOM_PRO_START,
    KICAD_CREATE_BOM_START,
    KICAD_CREATE_BOM_SUCCESS,
    KICAD_CREATE_BOM_ERROR,

    KICAD_READ_LIBRARIE_START,
    KICAD_READ_LIBRARIE_SUCCESS,
    KICAD_READ_LIBRARIE_ERROR,

    KICAD_NEW_LIBRARIE_START,

    KICAD_SAVE_LIBRARIE_START,

    KICAD_DOWNLOAD_FOOTPRINT_START,
    
    openKicadBomXml,
    openKicadProject,
    openKicadLibraire,
    newKicadLibrarie,
    saveKicadLibrarie,
    downloadKicadFootprint
}