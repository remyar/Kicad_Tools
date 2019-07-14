import Action from '../actions';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    switch (action.type) {
        case ( Action.export_file.EXPORT_FILE_START ):{
            return {
                ...state,
                data: [],
                isLoading: true
            }
        }
        case ( Action.export_file.EXPORT_FILE_SUCCESS  ):{
            return {
                ...state,
                isLoading: false,
                data: action.data
            }
        }
        case ( Action.export_file.EXPORT_FILE_ERROR ):{
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