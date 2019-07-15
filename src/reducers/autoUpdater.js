import autoUpdater from '../actions/autoUpdater';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    switch (action.type) {
        case ( autoUpdater.AUTOUPDATER_UPDATE_AVAILABLE ):{
            return {
                ...state,
                data: [],
                isLoading: false
            }
        }
        case ( autoUpdater.AUTOUPDATER_START_UPDATE  ):{
            return {
                ...state,
                isLoading: false,
                data: action.data
            }
        }
        case ( autoUpdater.AUTOUPDATER_UPDATE_SUCESS ):{
            return {
                ...state,
                isLoading: false,
                error : action.data
            }
        }
        default:
            return state;
    }
}