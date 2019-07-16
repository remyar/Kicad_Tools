import { AUTOUPDATER_UPDATE_AVAILABLE , AUTOUPDATER_START_UPDATE , AUTOUPDATER_UPDATE_SUCESS} from '../actions/autoUpdater';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    console.log(action.type);
    switch (action.type) {
        case ( AUTOUPDATER_UPDATE_AVAILABLE ):{
            return {
                ...state,
                data: action.data,
                isLoading: false
            }
        }
        case ( AUTOUPDATER_START_UPDATE  ):{
            return {
                ...state,
                isLoading: false,
                data: action.data
            }
        }
        case ( AUTOUPDATER_UPDATE_SUCESS ):{

            let snackBarObj = {};

            snackBarObj.message = "Download Update Success";
            snackBarObj.variant = 'success';
            snackBarObj.preventDuplicate = true;
            return {
                ...state,
                isLoading: false,
                snackBar: snackBarObj,
                time : new Date().getTime()
            }
        }
        default:
            return state;
    }
}