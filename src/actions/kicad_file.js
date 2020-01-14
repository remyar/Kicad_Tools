export const KICAD_CREATE_BOM_START = "KICAD_CREATE_BOM_START";
export const KICAD_CREATE_BOM_PRO_START = "KICAD_CREATE_BOM_PRO_START";
export const KICAD_CREATE_BOM_SUCCESS = "KICAD_CREATE_BOM_SUCCESS";
export const KICAD_CREATE_BOM_ERROR = "KICAD_CREATE_BOM_ERROR";
export const KICAD_READ_LIBRARIE_START = "KICAD_READ_LIBRARIE_START";
export const KICAD_READ_LIBRARIE_SUCCESS = "KICAD_READ_LIBRARIE_SUCCESS";
export const KICAD_READ_LIBRARIE_ERROR = "KICAD_READ_LIBRARIE_ERROR";

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

export default {
    KICAD_CREATE_BOM_PRO_START,
    KICAD_CREATE_BOM_START,
    KICAD_CREATE_BOM_SUCCESS,
    KICAD_CREATE_BOM_ERROR,

    KICAD_READ_LIBRARIE_START,
    KICAD_READ_LIBRARIE_SUCCESS,
    KICAD_READ_LIBRARIE_ERROR,
    
    openKicadBomXml,
    openKicadProject,
    openKicadLibraire
}