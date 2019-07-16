
import electron from 'electron';
export const AUTOUPDATER_UPDATE_AVAILABLE = "AUTOUPDATER_UPDATE_AVAILABLE";
export const AUTOUPDATER_START_UPDATE = "AUTOUPDATER_START_UPDATE";
export const AUTOUPDATER_UPDATE_SUCESS = "AUTOUPDATER_UPDATE_SUCESS";
export const AUTOUPDATER_UPDATE_ERROR = "AUTOUPDATER_UPDATE_ERROR";
export const AUTOUPDATER_EXIT_FOR_UPDATE = "AUTOUPDATER_EXIT_FOR_UPDATE";

export default function (dispatch, getState) {

    electron.ipcRenderer.on('update-available', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_UPDATE_AVAILABLE , data : message });
    });

    electron.ipcRenderer.on('download-progress', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_START_UPDATE , data : message });
        
    });
    
    electron.ipcRenderer.on('update-downloaded', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_UPDATE_SUCESS , data : message });
    });

    electron.ipcRenderer.on('update-quitForApply', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_EXIT_FOR_UPDATE , data : message });
    });
}