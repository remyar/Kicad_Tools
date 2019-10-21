export const KICAD_CREATE_BOM_START = "KICAD_CREATE_BOM_START";
export const KICAD_CREATE_BOM_SUCCESS = "KICAD_CREATE_BOM_SUCCESS";
export const KICAD_CREATE_BOM_ERROR = "KICAD_CREATE_BOM_ERROR";

function openKicadBomXml(){
    return {
        type : KICAD_CREATE_BOM_START 
    }
}

function openKicadProject(){
    return {
        type : KICAD_CREATE_BOM_START,
        fileType : ".pro"
    }
}

export default {
    KICAD_CREATE_BOM_START,
    KICAD_CREATE_BOM_SUCCESS,
    KICAD_CREATE_BOM_ERROR,
    openKicadBomXml,
    openKicadProject,
}