export const EXPORT_FILE_START = "EXPORT_FILE_START";
export const EXPORT_FILE_SUCCESS = "EXPORT_FILE_SUCCESS";
export const EXPORT_FILE_ERROR = "EXPORT_FILE_ERROR";

function exportBomToPdf( bom ){
    return {
        type : EXPORT_FILE_START ,
        format : "pdf",
        bom : bom,
    }
}

export default {
    EXPORT_FILE_START,
    EXPORT_FILE_SUCCESS,
    EXPORT_FILE_ERROR,
    exportBomToPdf
}