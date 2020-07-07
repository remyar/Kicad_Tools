
export const EAGLE_OPEN_LIB_FILE_START = "EAGLE_OPEN_LIB_FILE_START";
export const EAGLE_CONVERT_LIB_ERROR = "EAGLE_CONVERT_LIB_ERROR";
export const EAGLE_CONVERT_LIB_SUCCESS = "EAGLE_CONVERT_LIB_SUCCESS";

function openEagleLibrary(){
    return {
        type : EAGLE_OPEN_LIB_FILE_START 
    }
}

export default {

    EAGLE_OPEN_LIB_FILE_START,
    EAGLE_CONVERT_LIB_ERROR,
    EAGLE_CONVERT_LIB_SUCCESS,

    openEagleLibrary
}