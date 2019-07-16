import { AUTOUPDATER_UPDATE_AVAILABLE , AUTOUPDATER_START_UPDATE , AUTOUPDATER_UPDATE_SUCESS , AUTOUPDATER_EXIT_FOR_UPDATE} from '../actions/autoUpdater';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    console.log(action.type);
    switch (action.type) {
        case ( AUTOUPDATER_UPDATE_AVAILABLE ):{
            let snackBarObj = {};

            snackBarObj.message = "update.available";
            snackBarObj.variant = 'warning';
            snackBarObj.time = new Date().getTime();
            return {
                ...state,
                isLoading: false,
                snackBar: snackBarObj,
            }
        }
        case ( AUTOUPDATER_START_UPDATE  ):{
            let snackBarObj = {};

            snackBarObj.message = "update.download";
            snackBarObj.messageSup = " : " + parseInt(action.data.percent.toString()) + " %";
            snackBarObj.variant = 'info';
            snackBarObj.time = new Date().getTime();
            return {
                ...state,
                isLoading: false,
                snackBar: snackBarObj,
            }
        }
        case ( AUTOUPDATER_UPDATE_SUCESS ):{

            let snackBarObj = {};

            snackBarObj.message = "update.downloaded";
            snackBarObj.variant = 'success';
            snackBarObj.time = new Date().getTime();
            return {
                ...state,
                isLoading: false,
                snackBar: snackBarObj
            }
        }
        case ( AUTOUPDATER_EXIT_FOR_UPDATE ):{
            let snackBarObj = {};

            snackBarObj.message = "update.apply";
            snackBarObj.variant = 'warning';
            snackBarObj.time = new Date().getTime();
            return {
                ...state,
                isLoading: false,
                snackBar: snackBarObj
            }
        }
        default:
            return state;
    }
}